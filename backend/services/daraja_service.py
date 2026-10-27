"""Safaricom Daraja API Client Service (M-Pesa STK Push / Lipa Na M-Pesa Online).

Handles OAuth token retrieval, password generation, and STK push dispatch
for both Safaricom Sandbox and Production environments.
"""
import base64
from datetime import datetime, timezone
import logging
import os
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

# In-memory token cache
_cached_token: Optional[str] = None
_token_expiry: float = 0.0


def get_access_token() -> str:
    """Retrieves an active OAuth bearer token from Safaricom Daraja,

    caching it until near expiration.
    """
    global _cached_token, _token_expiry
    now = time.time()

    if _cached_token and now < (_token_expiry - 120):
        return _cached_token

    if not MPESA_CONSUMER_KEY or not MPESA_CONSUMER_SECRET:
        raise ValueError("MPESA_CONSUMER_KEY and MPESA_CONSUMER_SECRET must be configured.")

    auth_string = f"{MPESA_CONSUMER_KEY}:{MPESA_CONSUMER_SECRET}"
    encoded_auth = base64.b64encode(auth_string.encode()).decode("utf-8")

    url = f"{BASE_URL}/oauth/v1/generate?grant_type=client_credentials"
    headers = {"Authorization": f"Basic {encoded_auth}"}

    try:
        response = requests.get(url, headers=headers, timeout=12)
        response.raise_for_status()
        data = response.json()
        token = data.get("access_token")
        expires_in = int(data.get("expires_in", 3599))

        _cached_token = token
        _token_expiry = now + expires_in
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
    }

    logger.info(
        f"[Daraja] Dispatching STK push to {clean_phone} for KES {int_amount} "
        f"(Shortcode: {MPESA_SHORTCODE}, Env: {MPESA_ENV})."
    )

    try:
        response = requests.post(url, json=payload, headers=headers, timeout=15)
        res_json = response.json()
        logger.info(f"[Daraja] Response ({response.status_code}): {res_json}")
        return res_json
    except requests.RequestException as e:
        logger.error(f"[Daraja] STK push request failed: {e}")
        raise RuntimeError(f"Failed to communicate with Safaricom Daraja: {e}")
