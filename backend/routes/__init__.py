from .admin_router import router as admin_router
from .auth_router import router as auth_router
from .contracts_router import router as contracts_router
from .dashboard_router import router as dashboard_router
from .deals_router import router as deals_router
from .users_router import router as users_router
from .sso_router import router as sso_router
from .payments_router import router as payments_router
from .ticketing_router import router as ticketing_router
from .storefront_router import router as storefront_router
from .distro_router import router as distro_router
from .stream_router import router as stream_router
from .match_router import router as match_router

__all__ = [
    "admin_router",
    "auth_router",
    "contracts_router",
    "dashboard_router",
    "deals_router",
    "users_router",
    "sso_router",
    "payments_router",
    "ticketing_router",
    "storefront_router",
    "distro_router",
    "stream_router",
    "match_router",
]
