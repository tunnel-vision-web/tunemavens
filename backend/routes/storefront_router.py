"""Digital & Physical Storefront Router.

Handles product listing, product creation, order lookups,
and secure digital download streaming.
"""
from datetime import datetime, timezone
import logging
from typing import List, Optional


from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import FileResponse, RedirectResponse
from pydantic import BaseModel

from auth import get_current_user
from config import db
from models import Order, Product

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/storefront", tags=["storefront"])


class ProductCreateRequest(BaseModel):
    title: str
    description: Optional[str] = None
    price: float
    type: str  # 'physical' | 'digital'
    stock: Optional[int] = None
    file_url: Optional[str] = None


@router.post("/products", status_code=status.HTTP_201_CREATED)
def create_product(
    payload: ProductCreateRequest,
    current_user: dict = Depends(get_current_user),
):
    """Creates a new merchandise or digital product listing.

    Restricted to creators and execs.
    """
    user_roles = current_user.get("roles", [current_user.get("role", "creator")])
    if not any(r in ("creator", "admin", "exec", "label") for r in user_roles):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Restricted to Creators and Execs"
        )

    product_doc = Product(
        creator_id=str(current_user["_id"]),
        title=payload.title,
        description=payload.description,
        price=payload.price,
        type=payload.type,
        stock=payload.stock,
        file_url=payload.file_url,
    ).to_mongo()

    result = db.products.insert_one(product_doc)
    product_doc["_id"] = str(result.inserted_id)
    return product_doc


@router.get("/products")
def list_products():
    """Lists all products in the catalog."""
    cursor = db.products.find({})
    products_list = []
    for doc in cursor:
        doc["_id"] = str(doc["_id"])
        products_list.append(doc)
    return products_list


@router.get("/my-orders")
def list_my_orders(current_user: dict = Depends(get_current_user)):
    """Retrieves orders purchased by the current user with details."""
    cursor = db.orders.find({"user_id": str(current_user["_id"])})
    orders_list = []
    for doc in cursor:
        doc["_id"] = str(doc["_id"])
        
        # Attach product details
        product_doc = db.products.find_one({"_id": doc["product_id"]})
        if product_doc:
            product_doc["_id"] = str(product_doc["_id"])
            doc["product"] = product_doc
        else:
            doc["product"] = None
            
        orders_list.append(doc)
    return orders_list


@router.get("/products/{product_id}")
def get_product(product_id: str):
    """Retrieves single product details."""
    from bson import ObjectId
    try:
        doc = db.products.find_one({"_id": ObjectId(product_id)})
    except Exception:
        doc = db.products.find_one({"_id": product_id})

    if not doc:
        raise HTTPException(status_code=404, detail="Product not found")

    doc["_id"] = str(doc["_id"])
    return doc


class OrderFulfillRequest(BaseModel):
    tracking_number: Optional[str] = None
    carrier: Optional[str] = "Standard Shipping"
    status: Optional[str] = "shipped"


@router.post("/orders/{order_id}/fulfill")
def fulfill_order(
    order_id: str,
    payload: OrderFulfillRequest,
    current_user: dict = Depends(get_current_user),
):
    """Allows creators or admins to update physical order shipping status."""
    from bson import ObjectId
    user_roles = current_user.get("roles", [current_user.get("role", "creator")])
    if not any(r in ("creator", "admin", "exec", "label") for r in user_roles):
        raise HTTPException(status_code=403, detail="Restricted to Creators and Execs")

    try:
        order = db.orders.find_one({"_id": ObjectId(order_id)})
    except Exception:
        order = db.orders.find_one({"_id": order_id})

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    db.orders.update_one(
        {"_id": order["_id"]},
        {
            "$set": {
                "status": payload.status or "shipped",
                "tracking_number": payload.tracking_number,
                "carrier": payload.carrier,
                "fulfilled_at": datetime.now(timezone.utc),
            }
        }
    )
    return {"status": payload.status or "shipped", "order_id": str(order["_id"])}


@router.get("/download/{token}")
def download_digital_product(token: str):
    """Securely streams or redirects to a digital file download link

    after verifying the purchase download token.
    """
    order = db.orders.find_one({"download_token": token})
    if not order:
        raise HTTPException(status_code=404, detail="Invalid or expired download token")

    product = db.products.find_one({"_id": order["product_id"]})
    if not product or not product.get("file_url"):
        raise HTTPException(status_code=404, detail="Product file link not found")

    file_url = product["file_url"]

    # If it is a local static upload fallback file, serve it directly as a file download
    if "/uploads/" in file_url:
        relative_path = file_url.split("/uploads/")[-1]
        local_file_path = os.path.join(os.environ.get("LOCAL_UPLOADS_DIR", "uploads"), relative_path)
        if os.path.exists(local_file_path):
            filename = os.path.basename(local_file_path)
            return FileResponse(
                path=local_file_path,
                filename=filename,
                media_type="application/octet-stream"
            )

    # Otherwise redirect to the S3/R2 presigned URL prefix
    return RedirectResponse(url=file_url)

