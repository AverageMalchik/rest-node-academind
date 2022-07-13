const express = require("express");
const { default: mongoose } = require("mongoose");
const router = express.Router();
const checkAuth = require("../middleware/check-auth")

const Order = require("../models/orders");
const Products = require("../models/products");

router.get("/", checkAuth,(req, res, next) => {
  Order.find()
    .select("productId _id quantity")
    .populate("productId")
    .exec()
    .then((orders) => {
      res.status(200).json({
        count: orders.length,
        orders: orders.map((order) => {
          return {
            id: order._id,
            productId: order.productId,
            quantity: order.quantity,
            request: {
              type: "GET",
              url: `http://localhost:3000/orders/${order._id}`,
            },
          };
        }),
      });
    })
    .catch((e) => {
      console.log(e);
      res.status(500).json({
        error: e,
      });
    });
});

router.post("/", checkAuth, (req, res, next) => {
  Products.findById(req.body.productId)
    .then((product) => {
      if (!product) {
        const error = new Error("Product not found");
        error.status = 404;
        error.message = "Product not found";
        throw error;
      }
      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        productId: req.body.productId,
      });
      order
        .save()
        .then((result) => {
          console.log(result);
          res.status(201).json({
            message: "order created",
            createdOrder: {
              productId: result.productId,
              quantity: result.quantity,
              id: result._id,
              request: {
                type: "GET",
                url: `http://localhost:3000/orders/${result._id}`,
              },
            },
          });
        })
        .catch((e) => {
          console.log(e);
          res.status(500).json({
            error: e,
          });
        });
    })
    .catch((e) => {
      console.log(e.message);
      res.status(e.status || 500).json({
        error: e.message,
      });
    });
});

router.get("/:orderId", checkAuth, (req, res, next) => {
  const id = req.params.orderId;
  Order.findById(id)
    .select("product quantity _id")
    .exec()
    .then((order) => {
      console.log(order);
      if (order) {
        res.status(200).json(order);
      } else {
        res.status(404).json({
          error: "Order not found",
        });
      }
    })
    .catch((e) => {
      console.log(e);
      res.status(500).json({ error: e });
    });
});

router.delete("/:orderId", checkAuth, (req, res, next) => {
  const id = req.params.orderId;
  Order.remove({ _id: id })
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch((e) => {
      console.log(e);
      res.status(500).json({
        error: e,
      });
    });
});

module.exports = router;
