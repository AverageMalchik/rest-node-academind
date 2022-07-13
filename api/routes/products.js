const express = require("express");
const { default: mongoose, now } = require("mongoose");
const router = express.Router();
const multer = require("multer");
const checkAuth = require("../middleware/check-auth");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    console.log(req.file);
    cb(null, "abc.jpg");
  },
});
// reject or accept a file
// const fileFilter = (req, file, cb) => {
//   if (file.mimeType === "image/jpeg") {
//     cb(null, true);
//   } else {
//     cb(null, false);
//   }
// };

const upload = multer({
  storage: storage,
  // file limit to 5MB
  // limits: {
  //   fileSize: 1024 * 1024 * 5,
  // },
  // fileFilter: fileFilter,
});

const Product = require("../models/products");

router.get("/", (req, res, next) => {
  Product.find()
    .select("name _id price productImage")
    .exec()
    .then((docs) => {
      res.status(200).json({
        count: docs.length,
        products: docs.map((doc) => {
          return {
            id: doc._id,
            name: doc.name,
            price: doc.price,
            imageURL: `http://localhost:3000/${doc.productImage.replace(
              "\\",
              "/"
            )}`,
            request: {
              type: "GET",
              url: `http://localhost:3000/products/${doc._id}`,
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

router.post("/", checkAuth, upload.single("productImage"), (req, res, next) => {
  console.log(req.file);
  const product = new Product({
    _id: mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path,
  });
  product
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "product created",
        createdProduct: {
          name: result.name,
          price: result.price,
          id: result._id,
          request: {
            type: "GET",
            url: `http://localhost:3000/products/${result._id}`,
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
});

router.get("/:productId", checkAuth,(req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .select("name price _id")
    .exec()
    .then((doc) => {
      console.log(doc);
      if (doc) {
        res.status(200).json(doc);
      } else {
        res.status(404).json({
          error: "Document not found",
        });
      }
    })
    .catch((e) => {
      console.log(e);
      res.status(500).json({ error: e });
    });
});

router.delete("/:productId",checkAuth, (req, res, next) => {
  const id = req.params.productId;
  Product.deleteOne({ _id: id })
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

router.patch("/:productId", checkAuth,(req, res, next) => {
  const id = req.params.productId;
  Product.findByIdAndUpdate(id, { $set: req.body }, { new: true })
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
