const User = require("../Models/user");
const Order = require("../Models/order");

exports.getUserById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "No user was found in DB!",
      });
    }

    req.profile = user;
    next();
  });
};

exports.getUser = (req, res) => {
  req.profile.salt = undefined;
  req.profile.encry_Password = undefined;
  req.profile.createdAt = undefined;
  req.profile.updatedAt = undefined;
  req.profile.__v = undefined;
  req.profile.oPassword = undefined;
  return res.json(req.profile);
};

exports.updateUser = async (req, res) => {
  const id = req.params.userId;
  const update = req.body;
  const options = { new: true };
  User.findByIdAndUpdate(id, { $set: update }, options, function (err, user) {
    if (err) {
      console.log(err);
    } else {
      user.salt = undefined;
      user.encry_Password = undefined;
      user.createdAt = undefined;
      user.updatedAt = undefined;
      user.oPassword = undefined;
      user.__v = undefined;
      res.json(user);
    }
  });
};

exports.userPurchaseList = (req, res) => {
  Order.find({ user: req.profile._id })
    .populate("user", "_id name email")
    .exec((err, order) => {
      if (err) {
        res.status(400).json({
          error: "No order in the account!",
        });
      }

      return res.json(order);
    });
};

exports.pushOrderInPurchasList = (req, res, next) => {
  let purchases = [];
  req.body.order.products.foreach((product) => {
    purchases.push({
      _id: product._id,
      name: product.name,
      descrpition: product.descrpition,
      category: product.category,
      quantity: product.quantity,
      amount: req.body.order.amount,
      transaction_id: req.body.order.transaction_id,
    });
  });

  //Store in DB
  User.findOneAndUpdate(
    { _id: req.profile._id },
    { $push: { purchases: purchases } },
    { new: true },
    (err, purchases) => {
      if (err) {
        res.status(400).json({
          error: "Unable to save purchase list",
        });
        next();
      }
    }
  );
};
