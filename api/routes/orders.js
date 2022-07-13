const express = require("express");
const { default: mongoose } = require("mongoose");
const router = express.Router();
const checkAuth = require("../middleware/check-auth")

const Order = require("../models/orders");
const Products = require("../models/products");

const OrderController = require("../controllers/orders");

router.get("/", checkAuth,OrderController.get_all_orders);

router.post("/", checkAuth, OrderController.create_order);

router.get("/:orderId", checkAuth, OrderController.get_single_order);

router.delete("/:orderId", checkAuth, OrderController.delete_order);

module.exports = router;
