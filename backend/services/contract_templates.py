"""Industry-standard clause templates for the 3 contract types.

Every template captures the minimum set of clauses a real music-business
contract carries. Clauses flagged `negotiable=False` are locked because
they encode legal protections that music IP law expects to be present —
writer credit share floor, indemnity boilerplate, governing law, and so
on. Parties can invite counterparties to view and propose changes to the
negotiable clauses; the owner accepts or rejects each proposal.

References used to shape these clauses (industry-standard, not the code
of any single jurisdiction):
  - Association of Independent Music Publishers guidance
  - CISAC standard-terms for administration agreements
  - Kenya Copyright Act / Music Copyright Society of Kenya practice
  - US Copyright Act §106/§115 mechanical/performance framing
"""
from __future__ import annotations

# For each contract kind, `context` is a dict the caller supplies at
# draft time (e.g. tier, path, advance amount) and the templates
# interpolate it into the clause body strings.


def publishing_template(context: dict) -> tuple[str, list[dict]]:
    tier = (context.get("tier") or "standard_admin").strip()
    partner = context.get("copublisher_partner_id") or "the co-publisher"
    admin_pct = 15 if tier == "standard_admin" else 25
    writer_credit_floor = 50  # percent — statutory writer share protection

    title = f"Publishing Agreement — {tier.replace('_', ' ').title()}"
    clauses = [
        {
            "id": "parties",
            "title": "Parties",
            "body": "This Agreement is made between the Writer ("
            "referred to as \"you\") and TuneMavens ("
            f"acting {'as administrator' if tier == 'standard_admin' else f'together with {partner}'})."
            " Both parties acknowledge signing electronically.",
            "negotiable": False,
            "non_negotiable_reason": "The party block is standard for enforceability.",
        },
        {
            "id": "scope",
            "title": "Works Covered",
            "body": "All musical compositions written or co-written by you during the term of this Agreement, plus any prior works listed in Exhibit A.",
            "negotiable": True,
        },
        {
            "id": "term",
            "title": "Term",
            "body": "This Agreement runs for an initial term of three (3) years from the effective date, with automatic one-year renewals unless either party gives written notice at least ninety (90) days before renewal.",
            "negotiable": True,
        },
        {
            "id": "territory",
            "title": "Territory",
            "body": "Worldwide.",
            "negotiable": True,
        },
        {
            "id": "admin_fee",
            "title": "Administration Fee",
            "body": (
                f"TuneMavens{'' if tier == 'standard_admin' else ' and its co-publisher partners'} will retain {admin_pct}% of collected publisher revenue as the administration fee. "
                "The remainder is paid to you on the standard payout cadence."
            ),
            "negotiable": True,
        },
        {
            "id": "writer_share",
            "title": "Writer Credit Share",
            "body": (
                f"Your writer credit share of any composition you (co-)write is guaranteed at a minimum of {writer_credit_floor}% and is not affected by anything else in this Agreement. "
                "This protects your statutory writer entitlement."
            ),
            "negotiable": False,
            "non_negotiable_reason": (
                "Writer credit share is a moral and economic right in most jurisdictions. "
                "It cannot be waived or reduced by contract without breaching music IP law."
            ),
        },
        {
            "id": "advances",
            "title": "Advances & Recoupment",
            "body": "Any advance paid to you under this Agreement is recoupable only against your future publisher share. It is not cross-collateralised with distribution, sync, or other TuneMavens deals unless explicitly agreed in an Exhibit signed by both parties.",
            "negotiable": True,
        },
        {
            "id": "reporting",
            "title": "Statements & Audit Rights",
            "body": "TuneMavens will provide you with a quarterly statement itemising every income line. You have the right to inspect the underlying books once per calendar year on 30 days' notice.",
            "negotiable": True,
        },
        {
            "id": "warranty",
            "title": "Warranty & Indemnity",
            "body": "You warrant that the works are original and do not infringe third-party rights. You indemnify TuneMavens against any claim that a work infringes such rights.",
            "negotiable": False,
            "non_negotiable_reason": "Industry-standard IP warranty is required for any publisher to legally administer the works.",
        },
        {
            "id": "termination",
            "title": "Termination & Reversion",
            "body": "Either party may terminate for material breach with 60 days' cure period. On termination, administration of your works reverts to you 6 months after all outstanding balances have been settled.",
            "negotiable": True,
        },
        {
            "id": "governing_law",
            "title": "Governing Law",
            "body": "This Agreement is governed by the laws of your country of residence at the time of signing. Disputes are resolved by binding arbitration in that jurisdiction.",
            "negotiable": False,
            "non_negotiable_reason": "A governing-law clause is required for enforceability across borders.",
        },
    ]
    return title, clauses


def distribution_template(context: dict) -> tuple[str, list[dict]]:
    path = (context.get("path") or "tunemavens_native").strip()
    fee_structure = (context.get("fee_structure") or "flat_fee").strip()
    creator_split = context.get("creator_split_pct") or 55
    platform_split = context.get("tunemavens_split_pct") or 45

    title = f"Distribution Agreement — {path.replace('_', ' ').title()}"
    clauses = [
        {
            "id": "parties",
            "title": "Parties",
            "body": "This Distribution Agreement is between the Rights Holder (you) and TuneMavens Distribution.",
            "negotiable": False,
            "non_negotiable_reason": "The party block is standard for enforceability.",
        },
        {
            "id": "scope",
            "title": "Recordings Covered",
            "body": "All sound recordings you deliver via the TuneMavens catalogue-porting workflow during the term.",
            "negotiable": True,
        },
        {
            "id": "revenue_split",
            "title": "Revenue Split",
            "body": (
                "Revenue collected from digital service providers, radio, and downstream partners is split as follows: "
                f"{creator_split}% to you, {platform_split}% to TuneMavens."
                if fee_structure == "rev_share"
                else "TuneMavens charges a flat annual distribution fee. 100% of collected DSP revenue is paid to you, minus the flat fee shown in Exhibit B."
            ),
            "negotiable": True,
        },
        {
            "id": "term",
            "title": "Term & Rollover",
            "body": "Initial term of two (2) years, with automatic one-year rollovers unless either party gives 60 days' written notice.",
            "negotiable": True,
        },
        {
            "id": "territory",
            "title": "Territory",
            "body": "Worldwide, on every DSP TuneMavens is currently onboarded with. New DSP additions are opt-in.",
            "negotiable": True,
        },
        {
            "id": "content_ownership",
            "title": "Content Ownership",
            "body": "You retain 100% ownership of every recording. TuneMavens takes no equity in your masters.",
            "negotiable": False,
            "non_negotiable_reason": "Ownership retention is a core promise of the platform.",
        },
        {
            "id": "delivery",
            "title": "Delivery Standards",
            "body": "All recordings must be delivered at 44.1 kHz / 16-bit minimum with complete ISRCs, credits and metadata. Rejected deliveries can be resubmitted within 14 days.",
            "negotiable": False,
            "non_negotiable_reason": "DSPs enforce delivery standards; TuneMavens cannot lower them contractually.",
        },
        {
            "id": "warranty",
            "title": "Warranty & Indemnity",
            "body": "You warrant that you hold the rights to distribute the recordings and indemnify TuneMavens against third-party claims.",
            "negotiable": False,
            "non_negotiable_reason": "Standard IP warranty required for downstream DSP delivery.",
        },
        {
            "id": "termination",
            "title": "Termination & Take-Down",
            "body": "Either party may terminate for material breach with 60 days' cure. On termination, recordings are taken down from DSPs within 45 days; final earnings are held for 6 months for royalty settlement.",
            "negotiable": True,
        },
        {
            "id": "governing_law",
            "title": "Governing Law",
            "body": "This Agreement is governed by the laws of your country of residence at the time of signing.",
            "negotiable": False,
            "non_negotiable_reason": "Required for enforceability.",
        },
    ]
    return title, clauses


def catalogue_acquisition_template(context: dict) -> tuple[str, list[dict]]:
    advance = float(context.get("advance_amount") or 0)
    recoup_rate = float(context.get("recoupment_rate") or 70)
    partner = context.get("acquirer") or "TuneMavens Catalogue Partners"

    title = f"Catalogue Acquisition / Advance — {partner}"
    clauses = [
        {
            "id": "parties",
            "title": "Parties",
            "body": f"This Agreement is between you (as Rights Holder) and {partner} (as Acquirer / Advancer).",
            "negotiable": False,
            "non_negotiable_reason": "The party block is standard for enforceability.",
        },
        {
            "id": "advance",
            "title": "Advance Amount",
            "body": f"The Acquirer will pay you a non-refundable advance of USD {advance:,.2f} within 14 business days of contract execution.",
            "negotiable": True,
        },
        {
            "id": "scope",
            "title": "Catalogue Scope",
            "body": "The catalogue covered is listed in Exhibit A. New releases created after the effective date are not included unless a separate Exhibit is executed.",
            "negotiable": True,
        },
        {
            "id": "recoupment",
            "title": "Recoupment Rate",
            "body": (
                f"The advance is recouped from {recoup_rate:.0f}% of the Rights Holder's share of income (publisher share, master share, sync fees) attributable to the covered catalogue until the advance is fully recouped."
            ),
            "negotiable": True,
        },
        {
            "id": "post_recoup",
            "title": "Post-Recoupment Revenue Share",
            "body": "After full recoupment, 100% of the Rights Holder's share of income returns to you. The Acquirer retains no ongoing share unless separately agreed.",
            "negotiable": True,
        },
        {
            "id": "cross_collateralisation",
            "title": "Cross-Collateralisation",
            "body": "This advance is not cross-collateralised with any other TuneMavens deal (publishing, distribution, sync) unless expressly agreed in an Exhibit signed by both parties.",
            "negotiable": True,
        },
        {
            "id": "writer_share_floor",
            "title": "Writer Credit Share Protection",
            "body": "Your writer credit share remains untouched by this advance and cannot be reduced below the statutory floor by anything in this Agreement.",
            "negotiable": False,
            "non_negotiable_reason": "Writer credit share is protected by music IP law and cannot be waived.",
        },
        {
            "id": "reporting",
            "title": "Statements & Audit",
            "body": "The Acquirer will send a quarterly recoupment statement itemising every income line. You may audit the underlying books once per year on 30 days' notice.",
            "negotiable": True,
        },
        {
            "id": "reversion",
            "title": "Reversion on Recoupment",
            "body": "Once the advance is fully recouped, all rights and administration duties revert to you immediately.",
            "negotiable": False,
            "non_negotiable_reason": "Automatic reversion after recoupment is a core protection for the artist.",
        },
        {
            "id": "warranty",
            "title": "Warranty & Indemnity",
            "body": "You warrant that you hold the rights to the covered catalogue and indemnify the Acquirer against third-party claims.",
            "negotiable": False,
            "non_negotiable_reason": "Standard IP warranty is required.",
        },
        {
            "id": "governing_law",
            "title": "Governing Law",
            "body": "This Agreement is governed by the laws of your country of residence at the time of signing. Disputes are resolved by binding arbitration.",
            "negotiable": False,
            "non_negotiable_reason": "Required for enforceability.",
        },
    ]
    return title, clauses


def dj_mix_clearance_template(context: dict) -> tuple[str, list[dict]]:
    mix_title = context.get("mix_title") or "Curated DJ Mix"
    dj_name = context.get("dj_name") or "DJ"
    track_title = context.get("track_title") or "Featured Recording"
    artist = context.get("artist") or "Featured Artist"
    ip_owner_name = context.get("ip_owner_name") or "Rights Holder"
    price = float(context.get("commercial_price") or 4.99)
    dj_split_pct = float(context.get("dj_split_pct") or 40.0)
    track_owners_split_pct = float(context.get("track_owners_split_pct") or 50.0)
    platform_fee_pct = float(context.get("platform_fee_pct") or 10.0)
    pro_rated_track_split = float(context.get("pro_rated_track_split") or 12.5)

    title = f"DJ Mix Clearance & Revenue Split Agreement — {track_title} in '{mix_title}'"
    clauses = [
        {
            "id": "parties",
            "title": "Parties & Engagement",
            "body": (
                f"This Agreement is entered into between {dj_name} (the \"Curating DJ\"), "
                f"{ip_owner_name} (the \"IP Owner / Rights Holder\" of the recording '{track_title}' performed by {artist}), "
                "and TuneMavens (the \"Platform & Escrow Administrator\"). All parties agree to binding electronic execution."
            ),
            "negotiable": False,
            "non_negotiable_reason": "Standard multi-party identification for copyright clearance enforceability.",
        },
        {
            "id": "scope_and_license",
            "title": "Clearance Scope & License Grant",
            "body": (
                f"The IP Owner grants the Curating DJ and TuneMavens a non-exclusive, worldwide digital distribution license "
                f"to include the master recording and underlying musical composition of '{track_title}' "
                f"as part of the continuous DJ mix compilation entitled '{mix_title}', for commercial download, digital retail, and on-demand streaming."
            ),
            "negotiable": True,
        },
        {
            "id": "prior_consensus_condition",
            "title": "Condition Precedent — 100% IP Owner Agreement Required",
            "body": (
                "Prior to having any commercial sales, paid downloads, or paywalled streaming of the mix, "
                "ALL IP owners and rights holders whose works are included in the mix tracklist must be in complete agreement "
                "and have executed their respective clearance agreements on the TuneMavens platform. "
                "Commercial monetization remains cryptographically locked by the platform until 100% agreement is verified."
            ),
            "negotiable": False,
            "non_negotiable_reason": "Platform rule: No commercial sales occur without 100% prior rights-holder consensus.",
        },
        {
            "id": "revenue_splits",
            "title": "Revenue Waterfall & Split Cascade",
            "body": (
                f"Gross commercial revenue generated from the sale or monetization of '{mix_title}' (retail baseline: ${price:.2f} USD) "
                f"shall be automatically distributed via the TuneMavens Split Cascade as follows: "
                f"{dj_split_pct:.1f}% to Curating DJ ({dj_name}); "
                f"{track_owners_split_pct:.1f}% dedicated to the Track IP Owners Pool (with {pro_rated_track_split:.2f}% of total gross allocated to '{track_title}'); "
                f"and {platform_fee_pct:.1f}% to TuneMavens for payment gateway processing, statutory cue reporting, and escrow administration."
            ),
            "negotiable": True,
        },
        {
            "id": "track_extraction_and_playlist",
            "title": "Track Extraction & Interactive Playlist Attribution",
            "body": (
                f"The track '{track_title}' shall be clearly identified with timestamps in the mix cue tracklist, "
                "enabling listeners to jump directly to this track in the playlist view. "
                "Proper metadata credits (artist, title, publishing, ISRC if provided) shall be displayed at all times during playback."
            ),
            "negotiable": False,
            "non_negotiable_reason": "Attribution and cue sheet display integrity are mandatory for royalty tracing.",
        },
        {
            "id": "warranties",
            "title": "Warranties & Indemnification",
            "body": (
                "The IP Owner warrants that they own or represent the necessary rights to grant clearance for the specified track. "
                "The Curating DJ warrants that no unauthorized third-party audio has been mixed into this release without submission for clearance. "
                "Both parties agree that electronic signatures executed on TuneMavens carry full legal validity under applicable digital commerce laws."
            ),
            "negotiable": False,
            "non_negotiable_reason": "Standard IP mutual warranty block.",
        },
        {
            "id": "governing_law",
            "title": "Governing Law & Digital Audit",
            "body": (
                "This Agreement is governed by the laws of the jurisdiction of the Platform Administrator. "
                "All split distributions and signature records are permanently archived with tamper-evident SHA-256 digital seals."
            ),
            "negotiable": False,
            "non_negotiable_reason": "Required for multi-jurisdiction enforceability.",
        },
    ]
    return title, clauses


TEMPLATES = {
    "publishing": publishing_template,
    "distribution": distribution_template,
    "catalogue_acquisition": catalogue_acquisition_template,
    "dj_mix_clearance": dj_mix_clearance_template,
}


def build_contract(kind: str, context: dict) -> tuple[str, list[dict]]:
    if kind not in TEMPLATES:
        raise ValueError(f"Unknown contract kind: {kind}")
    return TEMPLATES[kind](context or {})
