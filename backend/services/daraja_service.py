"""Safaricom Daraja API Client Service (M-Pesa STK Push / Lipa Na M-Pesa Online).

Handles OAuth token retrieval, password generation, and STK push dispatch
for both Safaricom Sandbox and Production environments.
"""
import base64
from datetime import datetime, timezone
import json
import logging
import os
from pathlib import Path
import time
from typing import Any, Dict, Optional
import requests

logger = logging.getLogger("daraja_service")

# Environment configuration
MPESA_ENV = os.environ.get("MPESA_ENV", "sandbox").lower()
MPESA_CONSUMER_KEY = os.environ.get("MPESA_CONSUMER_KEY", "PfLcM0EDGzz6Ew6qv3qkwusk9Tsp864PHn9FgB1rqzRzOPRJ")
MPESA_CONSUMER_SECRET = os.environ.get("MPESA_CONSUMER_SECRET", "tp40JqNGpilM6Gg1nGeVmCHS72p2jLPWnCZQyy23OXGfoauSNnwoCyFfENw4pY9i")
MPESA_PASSKEY = os.environ.get("MPESA_PASSKEY", "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919")
MPESA_SHORTCODE = os.environ.get("MPESA_SHORTCODE", "174379")
MPESA_CALLBACK_URL = os.environ.get("MPESA_CALLBACK_URL", "https://api.tunemavens.com/api/payments/mpesa/callback")

BASE_URL = "https://sandbox.safaricom.co.ke" if MPESA_ENV == "sandbox" else "https://api.safaricom.co.ke"

# In-memory and persistent token cache
_cached_token: Optional[str] = None
_token_expiry: float = 0.0
_CACHE_FILE = Path(__file__).resolve().parent.parent / ".daraja_token_cache.json"


def _read_disk_token() -> Optional[str]:
    """Reads cached token from disk if valid."""
    global _cached_token, _token_expiry
    try:
        if _CACHE_FILE.exists():
            with open(_CACHE_FILE, "r") as f:
                data = json.load(f)
                if data.get("token") and time.time() < (data.get("expiry", 0) - 120):
                    _cached_token = data["token"]
                    _token_expiry = float(data.get("expiry", 0))
                    return _cached_token
    except Exception:
        pass
    return None


def _write_disk_token(token: str, expiry: float):
    """Saves valid token to disk."""
    try:
        with open(_CACHE_FILE, "w") as f:
            json.dump({"token": token, "expiry": expiry}, f)
    except Exception:
        pass


def get_access_token() -> str:
    """Retrieves an active OAuth bearer token from Safaricom Daraja,

    caching it until near expiration.
    """
    global _cached_token, _token_expiry
    now = time.time()

    if _cached_token and now < (_token_expiry - 120):
        return _cached_token

    disk_token = _read_disk_token()
    if disk_token:
        return disk_token

    if not MPESA_CONSUMER_KEY or not MPESA_CONSUMER_SECRET:
        raise ValueError("MPESA_CONSUMER_KEY and MPESA_CONSUMER_SECRET must be configured.")

    auth_string = f"{MPESA_CONSUMER_KEY}:{MPESA_CONSUMER_SECRET}"
    encoded_auth = base64.b64encode(auth_string.encode()).decode("utf-8")

    url = f"{BASE_URL}/oauth/v1/generate?grant_type=client_credentials"
    headers = {
        "Authorization": f"Basic {encoded_auth}",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json"
    }

    try:
        response = requests.get(url, headers=headers, timeout=12)
        response.raise_for_status()
        data = response.json()
        token = data.get("access_token")
        expires_in = int(data.get("expires_in", 3599))

        _cached_token = token
        _token_expiry = now + expires_in
        _write_disk_token(token, _token_expiry)
        logger.info(f"[Daraja] Successfully acquired access token (expires in {expires_in}s).")
        return token
    except Exception as e:
        logger.error(f"[Daraja] Failed to obtain access token: {e}")
        raise RuntimeError(f"Daraja OAuth Authentication failed: {e}")


def generate_stk_password(shortcode: str, passkey: str, timestamp_str: str) -> str:
    """Generates the Base64 password required for Daraja STK Push:

    Base64(BusinessShortCode + Passkey + Timestamp)
    """
    raw_data = f"{shortcode}{passkey}{timestamp_str}"
    return base64.b64encode(raw_data.encode("utf-8")).decode("utf-8")


def initiate_stk_push(
    phone_number: str,
    amount: float,
    account_reference: str = "TuneMavens",
    transaction_desc: str = "Credit Reload",
    callback_url: Optional[str] = None,
) -> Dict[str, Any]:
    """Dispatches a Lipa Na M-Pesa Online STK Push request to Safaricom Daraja.

    :param phone_number: Safaricom phone number in format 2547XXXXXXXX or 2541XXXXXXXX.
    :param amount: Amount in KES (rounded to nearest integer per Daraja requirements).
    :param account_reference: Alphanumeric account/order reference (e.g., 'TuneMavens').
    :param transaction_desc: Narrative description shown on device or statement.
    :param callback_url: Webhook endpoint for Safaricom callback.
    :return: Safaricom response dictionary containing CheckoutRequestID, MerchantRequestID, ResponseCode.
    """
    token = get_access_token()
    timestamp_str = datetime.now(timezone.utc).strftime("%Y%m%d%H%M%S")
    password = generate_stk_password(MPESA_SHORTCODE, MPESA_PASSKEY, timestamp_str)

    int_amount = max(1, int(round(amount)))
    clean_phone = phone_number.strip().replace("+", "").replace(" ", "")

    payload = {
        "BusinessShortCode": MPESA_SHORTCODE,
        "Password": password,
        "Timestamp": timestamp_str,
        "TransactionType": "CustomerPayBillOnline",
        "Amount": int_amount,
        "PartyA": clean_phone,
        "PartyB": MPESA_SHORTCODE,
        "PhoneNumber": clean_phone,
        "CallBackURL": callback_url or MPESA_CALLBACK_URL,
        "AccountReference": account_reference[:12],
        "TransactionDesc": transaction_desc[:12],
    }

    url = f"{BASE_URL}/mpesa/stkpush/v1/processrequest"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }

    logger.info(
        f"[Daraja] Dispatching STK push to {clean_phone} for KES {int_amount} "
        f"(Shortcode: {MPESA_SHORTCODE}, Env: {MPESA_ENV})."
    )

    try:
        response = requests.post(url, json=payload, headers=headers, timeout=15)
        try:
            res_json = response.json()
        except Exception:
            res_json = {
                "ResponseCode": str(response.status_code),
                "ResponseDescription": response.text[:200]
            }
        logger.info(f"[Daraja] Response ({response.status_code}): {res_json}")
        return res_json
    except requests.RequestException as e:
        logger.error(f"[Daraja] STK push request failed: {e}")
        raise RuntimeError(f"Failed to communicate with Safaricom Daraja: {e}")


def query_stk_status(checkout_request_id: str) -> Dict[str, Any]:
    """Queries Safaricom Daraja STK Push Query API to verify if payment was completed.

    :param checkout_request_id: Safaricom CheckoutRequestID returned from initiate_stk_push.
    :return: Safaricom response dictionary containing ResultCode and ResultDesc.
             ResultCode '0' means customer entered PIN and funds were deducted.
    """
    token = get_access_token()
    timestamp_str = datetime.now(timezone.utc).strftime("%Y%m%d%H%M%S")
    password = generate_stk_password(MPESA_SHORTCODE, MPESA_PASSKEY, timestamp_str)

    payload = {
        "BusinessShortCode": MPESA_SHORTCODE,
        "Password": password,
        "Timestamp": timestamp_str,
        "CheckoutRequestID": checkout_request_id,
    }

    url = f"{BASE_URL}/mpesa/stkpushquery/v1/query"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }

    try:
        response = requests.post(url, json=payload, headers=headers, timeout=12)
        try:
            res_json = response.json()
        except Exception:
            res_json = {
                "ResponseCode": str(response.status_code),
                "ResponseDescription": response.text[:200],
                "ResultCode": "pending"
            }
        logger.info(f"[Daraja Query] Status for {checkout_request_id}: {res_json}")
        return res_json
    except Exception as e:
        logger.warning(f"[Daraja Query] Query request exception for {checkout_request_id}: {e}")
        return {"error": str(e), "ResultCode": "pending"}
