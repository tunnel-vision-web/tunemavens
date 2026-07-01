"""Pydantic models for the TuneMavens backend.

Includes the User shape (extended with `dashboard_layout` per §9.6) and the three
new collections introduced in DOCUMENTATION.md §9.7:
  - publishing_deals
  - distribution_deals
  - catalogue_acquisitions

Phase 1 ships the models only — no business logic, no cascade, no contract gen.
Those land in Phase 7 / Phase 8.
"""
from __future__ import annotations

from datetime import datetime, timezone
from typing import Annotated, Any, List, Optional

from bson import ObjectId
from pydantic import BaseModel, BeforeValidator, ConfigDict, EmailStr, Field


# --- ObjectId helpers (PyObjectId pattern from system guidelines) ---
def _coerce_objectid(v: Any) -> str:
    if isinstance(v, ObjectId):
        return str(v)
    if isinstance(v, str):
        return v
    raise TypeError(f"Cannot coerce {type(v).__name__} to ObjectId string")


PyObjectId = Annotated[str, BeforeValidator(_coerce_objectid)]


class BaseDocument(BaseModel):
    """Common base — maps Mongo `_id` -> `id` and provides to_mongo/from_mongo."""

    model_config = ConfigDict(populate_by_name=True, arbitrary_types_allowed=True)

    id: Optional[PyObjectId] = Field(default=None, alias="_id")

    @classmethod
    def from_mongo(cls, doc: Optional[dict]):
        if doc is None:
            return None
        return cls.model_validate(doc)

    def to_mongo(self) -> dict:
        data = self.model_dump(by_alias=True, exclude_none=True)
        if data.get("_id") is None:
            data.pop("_id", None)
        return data


# ======================================================================
# Users (existing collection; we add dashboard_layout per §9.6)
# ======================================================================
class User(BaseDocument):
    email: EmailStr
    password_hash: Optional[str] = None
    name: Optional[str] = None
    role: str = "creator"  # creator | consumer | label | dj | studio | corporate | media_house | admin
    plan: str = "creator"
    credits: int = 0
    brand_name: Optional[str] = None
    country: Optional[str] = None
    bio: Optional[str] = None
    apps: List[str] = Field(default_factory=list)  # existing field — App Marketplace activation
    dashboard_layout: Optional[dict] = None  # §9.6 — per-user panel arrangement
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class UserPublic(BaseModel):
    """Sanitised user shape returned to the frontend (no password_hash)."""

    id: str
    email: EmailStr
    name: Optional[str] = None
    role: str = "creator"
    plan: str = "creator"
    credits: int = 0
    brand_name: Optional[str] = None
    country: Optional[str] = None
    bio: Optional[str] = None
    apps: List[str] = Field(default_factory=list)
    dashboard_layout: Optional[dict] = None


# ======================================================================
# Auth request shapes
# ======================================================================
class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    name: Optional[str] = None
    role: str = "creator"
    brand_name: Optional[str] = None
    country: Optional[str] = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class AuthResponse(BaseModel):
    user: UserPublic
    access_token: str
    token_type: str = "bearer"


# ======================================================================
# Dashboard layout (§9.6 — per-user custom panel ordering)
# ======================================================================
class DashboardLayoutUpdate(BaseModel):
    dashboard_layout: dict


# ======================================================================
# §9.7 — publishing_deals
# ======================================================================
class PublisherShareSplit(BaseModel):
    tunemavens_pct: float = 50.0
    creator_publisher_pct: float = 50.0
    copublisher_partner_pct: Optional[float] = None


class WriterCreditShare(BaseModel):
    applies: bool = False
    pct: float = 0.0
    contributors: List[str] = Field(default_factory=list)


class PublishingDeal(BaseDocument):
    creator_id: PyObjectId
    tier: str  # 'standard_admin' | 'full_service_copub'
    copublisher_partner_id: Optional[PyObjectId] = None
    publisher_share_split: PublisherShareSplit = Field(default_factory=PublisherShareSplit)
    writer_credit_share: WriterCreditShare = Field(default_factory=WriterCreditShare)
    recoupment_balance: float = 0.0
    status: str = "active"  # 'active' | 'superseded' | 'terminated'
    superseded_at: Optional[datetime] = None
    contract_id: Optional[PyObjectId] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# ======================================================================
# §9.7 — distribution_deals
# ======================================================================
class DistributionDeal(BaseDocument):
    creator_id: PyObjectId
    path: str  # 'standard_fee_matched' | 'tunemavens_native' | 'label_negotiated'
    fee_structure: str  # 'flat_fee' | 'rev_share'
    tunemavens_split_pct: Optional[float] = None  # 45 for native default
    creator_split_pct: Optional[float] = None  # 55 for native default
    negotiation_history: List[dict] = Field(default_factory=list)
    status: str = "active"  # 'active' | 'superseded' | 'terminated'
    superseded_at: Optional[datetime] = None
    contract_id: Optional[PyObjectId] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# ======================================================================
# §9.7 — catalogue_acquisitions (recoupment ledger)
# ======================================================================
class CatalogueAcquisition(BaseDocument):
    creator_id: PyObjectId
    deal_type: str  # 'catalogue_purchase' | 'publishing_advance' | 'distribution_advance' | 'sync_advance'
    original_amount: float
    recouped_to_date: float = 0.0
    remaining_balance: float
    cross_collateralized: bool = False
    linked_contract_id: Optional[PyObjectId] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# ======================================================================
# Domain Mappings (admin-only) — maps in-app routes to public subdomains
# ======================================================================
class DomainMapping(BaseDocument):
    key: str                       # unique stable id (e.g. 'native-app-tunemavens')
    label: str                     # human-readable name
    category: str                  # 'native-app' | 'dashboard-app' | 'ai-tool' | 'subdomain-portal'
    path: str                      # local SPA route (e.g. '/native-apps/tunemavens')
    subdomain: str                 # e.g. 'app' -> app.tunemavens.com
    enabled: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_by: Optional[str] = None


class DomainMappingUpdate(BaseModel):
    label: Optional[str] = None
    subdomain: Optional[str] = None
    enabled: Optional[bool] = None


class DomainMappingCreate(BaseModel):
    key: str
    label: str
    category: str
    path: str
    subdomain: str
    enabled: bool = True



# ======================================================================
# §9.8 — Onboarding responses & the AI Recommendation Agent
# ======================================================================
class OnboardingResponse(BaseModel):
    """Free-form yet structured questionnaire captured on first-run.

    Every field is optional so users can skip and revise. The
    Recommendation Agent (see backend/services/recommendation_engine.py)
    reads this + the user's activity log to produce ranked app picks.
    """
    primary_goal: Optional[str] = None          # release_music | manage_roster | grow_fans | sync_licensing | sell_at_shows | consume
    release_cadence: Optional[str] = None       # 0 | 1-3 | 4-10 | 10+
    distribution_setup: Optional[str] = None    # none | diy_aggregator | label_deal | self_distributed
    revenue_focus: Optional[str] = None         # streaming | live | sync | tips_merch
    team_size: Optional[str] = None             # solo | 2-5 | 6-20 | 20+
    country: Optional[str] = None               # ISO 3166-1 alpha-2
    freeform_notes: Optional[str] = None        # anything else the user wants the agent to know
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ActivityEvent(BaseModel):
    """A single behaviour signal — tab visits, deal creations, activations."""
    kind: str                                   # tab_visit | deal_created | app_activated | app_deactivated | stripe_progress
    ref: Optional[str] = None                   # tab id / deal type / slug etc.
    meta: Optional[dict] = None
    at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class Recommendation(BaseModel):
    """A single ranked app pick returned by the Recommendation Agent."""
    slug: str
    rationale: str
    priority: int                               # 1 = strongest pick
    source: str = "rules"                       # rules | llm
