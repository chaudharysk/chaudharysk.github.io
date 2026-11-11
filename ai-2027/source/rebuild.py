"""Portable rebuild helper, published as ai-2027/source/rebuild.py."""
from pathlib import Path
from tempfile import TemporaryDirectory
import shutil
import subprocess
import sys

SITE = Path(__file__).resolve().parents[1]
SOURCE = SITE / "source"
ASSETS = SITE / "assets"

with TemporaryDirectory(prefix="ai-2027-build-") as temporary:
    work = Path(temporary)
    (work / "dist/assets").mkdir(parents=True)
    shutil.copy2(ASSETS / "study-plan.md", work / "dist/assets/study-plan.md")
    for name in ("build_data.py", "build_path.py"):
        shutil.copy2(SOURCE / name, work / name)
        subprocess.run([sys.executable, str(work / name)], check=True)
    for name in ("data.js", "learning-path.js", "parallel-learning-path.svg"):
        shutil.copy2(work / "dist/assets" / name, ASSETS / name)

print("Rebuilt the curriculum data and parallel learning diagram.")
