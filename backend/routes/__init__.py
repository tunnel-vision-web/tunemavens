from .admin_router import router as admin_router
from .auth_router import router as auth_router
from .dashboard_router import router as dashboard_router
from .deals_router import router as deals_router

__all__ = ["admin_router", "auth_router", "dashboard_router", "deals_router"]
