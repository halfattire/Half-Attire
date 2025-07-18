import express from "express";
import { createProduct, getAllShopProducts,deleteShopProduct, getAllProducts,createReview, adminAllProducts } from "../controller/productController.js";
import { isAdmin, isAuthenticated, isSeller } from "../middleware/auth.js";

const productRouter = express.Router();

// Protected routes with authentication middleware
productRouter.post("/create-product", isSeller, createProduct);
productRouter.get("/get-all-shop-products/:id", getAllShopProducts)
productRouter.delete("/delete-shop-products/:id", isSeller, deleteShopProduct)
productRouter.get("/get-all-products", getAllProducts)
productRouter.put("/create-new-review", isAuthenticated, createReview);

// Admin routes with authentication
productRouter.get("/admin-all-products", isAuthenticated, isAdmin, adminAllProducts);

export default productRouter;
