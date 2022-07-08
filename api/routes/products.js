const express = require("express");
const { default: mongoose } = require("mongoose");
const router = express.Router();

const Product = require("../models/products");

router.get("/", (req, res, next) => {
  Product.find().exec().then(docs => {
    console.log(docs);
    res.status(200).json(docs);
  }).catch(e => {
    console.log(e);
    res.status(500).json({
        error: e
    });
  });
});

router.post("/", (req, res, next) => {
  const product = new Product({
    _id: mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
  });
  product
    .save()
    .then((result) => {
        console.log(result)
        res.status(201).json({
            message: "product created",
            createdProduct: result,
          });
    })
    .catch((e) => {
        console.log(e)
        res.status(500).json({
            error: e
        })
    });
  
});

router.get("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .exec()
    .then((doc) => {
      console.log(doc);
      if (doc) {
        res.status(200).json(doc);
      } else {
        res.status(404).json({
            error: "Document not found"
        })
      }
      
    })
    .catch((e) => {
      console.log(e);
      res.status(500).json({ error: e });
    });
});

router.delete("/:productId", (req,res,next) => {
    const id = req.params.productId;
    Product.remove({_id: id}).exec().then(result=>{
        console.log(result);
        res.status(200).json(result);
    }).catch(e => {
        console.log(e);
        res.status(500).json({
            error: e
        });
    });
});

router.patch("/:productId", (req,res,next) => {
    const id = req.params.productId;
    Product.findByIdAndUpdate(id,{$set:req.body},{new: true}).exec().then(result=>{
        console.log(result);
        res.status(200).json(result);
    }).catch(e=> {
        console.log(e);
        res.status(500).json({
            error: e
        });
    });

});

module.exports = router;
