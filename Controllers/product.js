const Product = require("../Models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

exports.getProductById = (req, res, next, id) => {
  Product.findById(id)
    .populate("category")
    .exec((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "Product not found!",
        });
      }
      req.product = product;
      next();
    });
};

exports.createProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "Problem with image!",
      });
    }

    //destructuring the fields
    const { name, price, description, category, stock } = fields;

    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({
        error: "Please include all fields!",
      });
    }

    //Restrictions on fields
    let product = new Product(fields);

    //Handle file here
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "File size too big!",
        });
      }

      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    //Save to DB
    product.save((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "Saving T shirt in DB failed!",
        });
      }

      res.json(
        { product },
        (product.createdAt = undefined),
        (product.updatedAt = undefined),
        (product.__v = undefined)
      );
    });
  });
};

exports.getProduct = (req, res) => {
  res.product.photo = undefined;
  return res.json(req.product);
};

//Delete Controller
exports.deleteProduct = (req, res) => {
  let product = req.product;
  product.remove((err, product) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to delete the product!",
      });
    }

    res.json({
      message: "Deletion was a success",
      product,
    });
  });
};

//Update Controller
exports.updateProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "Problem with image!",
      });
    }

    //Updation Code
    let product = req.product;
    product = _.extend(product, fields);

    //Handle file here
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "File size too big!",
        });
      }

      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    //Save to DB
    product.save((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "Updation of product failed!",
        });
      }

      res.json(
        { product },
        (product.createdAt = undefined),
        (product.updatedAt = undefined),
        (product.__v = undefined)
      );
    });
  });
};

//Product Listing
exports.getAllProducts = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 8;
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";

  Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy, "asc"]])
    .limit(limit)
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({
          error: "No product found!",
        });
      }
      res.json(products);
    });
};

exports.getAllUniqueCategories = (req, res) => {
  Product.distinct("category", {}, (err, category) => {
    if (err) {
      return res.status(400).json({
        error: "No category found!",
      });
    }

    res.json(category);
  });
};

//Middleware
exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set("Content-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};

exports.updateStock = (req, res, next) => {
  let myOperations = req.body.order.products.map((prod) => {
    return {
      updateOne: {
        filter: { id: prod._id },
        update: { $inc: { stock: -prod.count, sold: +prod.count } },
      },
    };
  });

  Product.bulkWrite(myOperations, {}, (err, product) => {
    if (err) {
      return res.status(400).json({
        error: "Bulk operation failed!",
      });
    }
    // res.json(product)

    next();
  });
};
