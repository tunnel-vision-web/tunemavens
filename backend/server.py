"""Shim: route Emergent's supervisor (which runs `/app/backend/server.py`)
to the TuneMavens Phase 1 backend living in the repo at
`/app/tunemavens_repo/backend/`.
"""
import importlib.util
import sys
from pathlib import Path

from dotenv import load_dotenv

_TUNEMAVENS_BACKEND = Path("/app/tunemavens_repo/backend").resolve()

# Make the repo's backend modules importable as top-level names without
# colliding with this shim module (which is also named `server`).
if str(_TUNEMAVENS_BACKEND) not in sys.path:
    sys.path.insert(0, str(_TUNEMAVENS_BACKEND))

load_dotenv(_TUNEMAVENS_BACKEND / ".env", override=True)

# Load the repo's server.py under a distinct module name to avoid recursion.
_spec = importlib.util.spec_from_file_location(
    "tunemavens_server", _TUNEMAVENS_BACKEND / "server.py"
)
_module = importlib.util.module_from_spec(_spec)
sys.modules["tunemavens_server"] = _module
_spec.loader.exec_module(_module)

app = _module.app  # re-export for uvicorn
