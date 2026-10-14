#!/usr/bin/env python3
"""Execute every catalogued notebook in a fresh kernel using this interpreter."""

from __future__ import annotations

import argparse
import copy
import hashlib
import json
import os
from pathlib import Path
import math
import re
import sys
import tempfile

import nbformat
from nbclient import NotebookClient


ROOT = Path(__file__).resolve().parents[1]
NUMBER = re.compile(r"[-+]?(?:\d+\.\d*|\.\d+|\d+)(?:[eE][-+]?\d+)?")
CATALOGS = {
    "catalog.json": ("intuition", "build-your-intuition"),
    "quantum-catalog.json": ("quantum", "explore-quantum-systems"),
}


def catalogued_paths(filenames: list[str]) -> list[Path]:
    """Read explicit module catalogs and reject duplicate or escaping paths."""
    paths: list[Path] = []
    seen_paths: set[Path] = set()
    for filename in filenames:
        module_id, directory = CATALOGS[filename]
        catalog = json.loads((ROOT / "notebooks" / filename).read_text())
        if (
            not isinstance(catalog, dict)
            or catalog.get("version") != 1
            or catalog.get("moduleId") != module_id
            or not isinstance(catalog.get("notebooks"), list)
            or not catalog["notebooks"]
        ):
            raise ValueError(f"{filename}: expected an executed notebook series for {module_id}")
        seen_ids: set[str] = set()
        for entry in catalog["notebooks"]:
            if not isinstance(entry, dict):
                raise ValueError(f"{filename}: invalid notebook catalog entry")
            notebook_id = entry.get("id")
            notebook_filename = entry.get("filename")
            if (
                not isinstance(notebook_id, str)
                or re.fullmatch(r"[a-z0-9-]+", notebook_id) is None
                or notebook_id in seen_ids
                or not isinstance(notebook_filename, str)
                or re.fullmatch(r"[a-z0-9][a-z0-9-]*\.ipynb", notebook_filename) is None
                or entry.get("path") != f"notebooks/{directory}/{notebook_filename}"
            ):
                raise ValueError(f"{filename}: invalid notebook catalog entry {notebook_id!r}")
            path = (ROOT / entry["path"]).resolve()
            if not path.is_relative_to(ROOT / "notebooks" / directory) or path in seen_paths:
                raise ValueError(f"{filename}: duplicate or escaping notebook path {entry['path']}")
            if not path.is_file():
                raise ValueError(f"{filename}: missing catalogued notebook {entry['path']}")
            seen_ids.add(notebook_id)
            seen_paths.add(path)
            paths.append(path)
    return paths


def verify_saved_outputs(notebook: nbformat.NotebookNode, name: str) -> int:
    """Reject missing or stale saved execution markers and recorded failures."""
    nbformat.validate(notebook)
    code_cells = [cell for cell in notebook.cells if cell.cell_type == "code"]
    if not code_cells:
        raise ValueError(f"{name}: no code cells")
    for index, cell in enumerate(code_cells, start=1):
        digest = hashlib.sha256(cell.source.encode("utf-8")).hexdigest()
        if cell.metadata.get("source_sha256") != digest:
            raise ValueError(f"{name}: code cell {index} changed after its saved execution")
        if cell.execution_count != index:
            raise ValueError(f"{name}: code cell {index} was not executed in order")
        if not cell.outputs:
            raise ValueError(f"{name}: code cell {index} has no saved output")
        if any(output.output_type == "error" for output in cell.outputs):
            raise ValueError(f"{name}: code cell {index} contains an execution error")
    return len(code_cells)


def execute(notebook: nbformat.NotebookNode, directory: Path) -> nbformat.NotebookNode:
    working = copy.deepcopy(notebook)
    for cell in working.cells:
        if cell.cell_type == "code":
            cell.execution_count = None
            cell.outputs = []
            cell.metadata.pop("execution", None)
    client = NotebookClient(
        working,
        kernel_name="python3",
        timeout=120,
        allow_errors=False,
        record_timing=False,
        resources={"metadata": {"path": str(directory)}},
    )
    manager = client.create_kernel_manager()
    # A system kernelspec may point at another Python. Use the environment that
    # launched this command, including its installed NumPy/Matplotlib versions.
    manager.kernel_spec.argv = [
        sys.executable,
        "-m",
        "ipykernel_launcher",
        "-f",
        "{connection_file}",
    ]
    executed = client.execute()
    for cell in executed.cells:
        if cell.cell_type == "code":
            cell.metadata["source_sha256"] = hashlib.sha256(cell.source.encode("utf-8")).hexdigest()
    return executed


def verify_saved_numbers(saved: nbformat.NotebookNode, replayed: nbformat.NotebookNode, name: str) -> None:
    """Compare displayed scientific numbers, not version-dependent PNG bytes."""
    for old_cell, new_cell in zip(saved.cells, replayed.cells):
        if old_cell.cell_type != "code" or old_cell.execution_count == 1:
            # The setup prints installed package versions, not model results.
            continue
        def stdout(cell: nbformat.NotebookNode) -> str:
            return "".join(
                output.text for output in cell.outputs
                if output.output_type == "stream" and output.name == "stdout"
            )
        old_numbers = [float(value) for value in NUMBER.findall(stdout(old_cell))]
        new_numbers = [float(value) for value in NUMBER.findall(stdout(new_cell))]
        if len(old_numbers) != len(new_numbers) or any(
            not math.isclose(old, new, rel_tol=1e-10, abs_tol=1e-10)
            for old, new in zip(old_numbers, new_numbers)
        ):
            raise ValueError(
                f"{name}: saved numbers differ from replay in code cell {old_cell.execution_count}; "
                "review the change, then refresh outputs with --write"
            )


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    mode = parser.add_mutually_exclusive_group()
    mode.add_argument("--check", action="store_true", help="verify and replay without modifying files")
    mode.add_argument("--write", action="store_true", help="execute and save fresh outputs")
    parser.add_argument(
        "--catalog",
        action="append",
        choices=tuple(CATALOGS),
        help="select a module catalog; repeat to select several (default: both modules)",
    )
    args = parser.parse_args()
    filenames = list(dict.fromkeys(args.catalog or CATALOGS))
    paths = catalogued_paths(filenames)
    with tempfile.TemporaryDirectory(prefix="quantum-notebook-") as cache:
        writable_cache = Path(cache) / "cache"
        writable_cache.mkdir()
        os.environ.setdefault("XDG_CACHE_HOME", str(writable_cache))
        os.environ.setdefault("MPLCONFIGDIR", str(Path(cache) / "matplotlib"))
        os.environ.setdefault("IPYTHONDIR", str(Path(cache) / "ipython"))
        os.environ.setdefault("JUPYTER_RUNTIME_DIR", str(Path(cache) / "runtime"))
        total_cells = 0
        for path in paths:
            notebook = nbformat.read(path, as_version=4)
            if not args.write:
                verify_saved_outputs(notebook, path.name)
            executed = execute(notebook, path.parent)
            count = verify_saved_outputs(executed, path.name)
            if not args.write:
                verify_saved_numbers(notebook, executed, path.name)
            if args.write:
                nbformat.write(executed, path)
            total_cells += count
            print(f"PASS {path.name}: {count} code cells, all assertions and outputs verified")
        print(f"Verified {len(paths)} notebooks and {total_cells} code cells across {len(filenames)} catalogs.")


if __name__ == "__main__":
    main()
