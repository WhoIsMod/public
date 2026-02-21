"""
Utilities for hashing and securing sensitive data at rest.
- hash_value: HMAC-SHA256 for deterministic lookups (e.g. OMANG)
- encrypt_value / decrypt_value: Fernet for reversible PII (display, search)
"""
import hashlib
import hmac
import base64
from django.conf import settings

try:
    from cryptography.fernet import Fernet
    from cryptography.hazmat.primitives import hashes
    from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
    HAS_CRYPTO = True
except ImportError:
    HAS_CRYPTO = False


def get_pepper():
    """Derive a pepper from SECRET_KEY for hashing."""
    return (settings.SECRET_KEY or "fallback").encode("utf-8")


def _get_fernet():
    """Create Fernet instance from SECRET_KEY."""
    if not HAS_CRYPTO:
        return None
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=b"sensorium_patient_portal",
        iterations=100000,
    )
    key = base64.urlsafe_b64encode(kdf.derive(get_pepper()))
    return Fernet(key)


def hash_value(value):
    """
    One-way HMAC-SHA256 hash. Deterministic: same input + pepper = same output.
    Use for lookup fields (e.g. OMANG) - store hash, lookup by hashing input.
    """
    if value is None or value == "":
        return None
    return hmac.new(
        get_pepper(),
        str(value).strip().encode("utf-8"),
        hashlib.sha256,
    ).hexdigest()


def encrypt_value(value):
    """Encrypt value for reversible storage. Returns base64 string or None."""
    if value is None or value == "":
        return None
    f = _get_fernet()
    if not f:
        return value
    return f.encrypt(str(value).encode("utf-8")).decode("ascii")


def decrypt_value(value):
    """Decrypt value. Returns plaintext or original if not encrypted."""
    if value is None or value == "":
        return None
    f = _get_fernet()
    if not f:
        return value
    try:
        return f.decrypt(value.encode("ascii")).decode("utf-8")
    except Exception:
        return value
