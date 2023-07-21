const authContoller = require("../controllers/authController");
const productsController = require("../controllers/productsController");
const cartController = require("../controllers/cartController");
const validator = require("../util/JsonWEBTokenValidator/validator");

module.exports = function (app, router) {
  // SignUp API
  app.route("/signUp").post(authContoller.signup);
  // login API
  app.route("/login").post(authContoller.login);
  //  refresh API
  app.route("/refresh").post(authContoller.refreshToken);
  // allProducts API
  app.route("/allProducts").get(productsController.products);
  // porduct API
  app.route("/product").post(productsController.product);
  // addToCart API
  app.route("/addToCart").post(validator.validate, cartController.addToCart);
  // getCartItems API
  app
    .route("/getCartItems")
    .get(validator.validate, cartController.getCartItems);
  // deleteCartItem API
  app
    .route("/deleteCartItem")
    .post(validator.validate, cartController.deleteCartItems);
  // addresses API
  app.route("/addresses").get(validator.validate, authContoller.getAddresses);
  // addaddress API
  app.route("/addaddress").post(validator.validate, authContoller.addAddress);
  // deleteaddress API
  app
    .route("/deleteaddress")
    .post(validator.validate, authContoller.deleteAddress);
  // updateAddress API
  app
    .route("/updateAddress")
    .post(validator.validate, authContoller.updateAddress);
  // placeorder API
  app.route("/placeorder").post(validator.validate, authContoller.orderItems);
  // orders API
  app.route("/orders").get(validator.validate, authContoller.orders);
  // customers API
  app.route("/customer").get(validator.validate, authContoller.getCustomers);
  // updateCustomer API
  app
    .route("/updateCustomer")
    .post(validator.validate, authContoller.updateCustomer);
};
