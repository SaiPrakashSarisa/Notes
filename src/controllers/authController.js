const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const NodeCache = require("node-cache");
const myCache = new NodeCache();

require("dotenv").config();

const register = require("../util/MYSQL_QUERIES/register_customer");
const customers = require("../util/MYSQL_QUERIES/get_customers");
const prodQueries = require("../util/MYSQL_QUERIES/get_products");

/**
 *@param {JSON} req This Object contains the body sent through the request end to register the user.
 This request body should contain userName, email, phone, password to register the user.
 *@param {JSON} res This Object contains the response with the register status or an error message. 
 *@returns {JSON} this object returns the response and deals with errors if any
 */
exports.signup = [
  bodyParser.urlencoded({ extended: true }),
  bodyParser.json(),
  async (req, res) => {
    console.log("Inside sign up controller");

    const { userName, email, phone, password } = req.body;

    console.log({ userName, email, phone, password });
    try {
      const result = await register.registerUser(
        userName,
        email,
        phone,
        password
      );
      res.status(200).json(result);
    } catch (err) {
      console.error("Error", err);
    }
  },
];

/**
 * Refresh Token Function provides new access token and refresh token
 * @param {JSON} req This Object contains the body sent through the request end to create new access token when token gets expired.
 * This request body must contain refresh token in order to create a new access token.
 * @param {JSON} res This Object contains the response with new access token and refresh token or an error message if refresh token is invalid.
 *  */
exports.refreshToken = [
  bodyParser.json(),
  bodyParser.urlencoded({ extended: true }),
  (req, res) => {
    const refreshToken = req.body.refreshToken;
    const refreshKey = process.env.REFRESH_TOKEN_SECRET;
    const accessKey = process.env.ACCESS_TOKEN_SECRET;

    console.log("refreshToken : ", refreshToken);
    console.log("refreshKey : ", refreshKey);
    console.log("req.body :", req.body);

    jwt.verify(refreshToken, refreshKey, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "invalid refresh token" });
      }

      console.log("decoded ", decoded);

      const accessToken = jwt.sign(
        {
          cust_Id: decoded.cust_Id,
          custName: decoded.custName,
          email: decoded.email,
          phone: decoded.phone,
        },
        accessKey,
        { expiresIn: "30min" }
      );

      const newRefreshToken = jwt.sign(
        {
          cust_Id: decoded.cust_Id,
          custName: decoded.custName,
          email: decoded.email,
          phone: decoded.phone,
        },
        refreshKey,
        { expiresIn: "5hr" }
      );

      return res.status(200).json({
        accessToken: accessToken,
        refreshToken: newRefreshToken,
      });
    });
  },
];

/**
 * Longin Function to log user
 * @param {JSON} req This Object contains the body sent through the request end to log the user.
 * This requset body must contain emailORphone and password to login.
 * @param {JSON} res  This Object contains the response with a new access token and refresh token if user credentials are matced or sends an error message.
 */
exports.login = [
  bodyParser.urlencoded({ extended: true }),
  bodyParser.json(),
  async (req, res) => {
    // console.log(req.body);
    const { emailORphone, password } = req.body;

    try {
      const loggedUser = await customers.findloggedUser(emailORphone, password);
      // console.log(loggedUser);
      if (loggedUser.length === 0) {
        res.status(401).send("Invalid user!!!");
      } else {
        const access_token_key = process.env.ACCESS_TOKEN_SECRET;
        const refresh_token_key = process.env.REFRESH_TOKEN_SECRET;

        const payload = {
          cust_Id: loggedUser[0].cust_Id,
          custName: loggedUser[0].custName,
          email: loggedUser[0].email,
          phone: loggedUser[0].phone,
        };

        // CREATING ACCESS_TOKEN
        const accessToken = jwt.sign(payload, access_token_key, {
          expiresIn: "30min",
        });

        //CREATING REFRESH_TOKEN
        const refreshToken = jwt.sign(payload, refresh_token_key, {
          expiresIn: "5hr",
        });
        res.status(200).json({
          accessToken,
          refreshToken,
          expiresIn: "5sec",
        });
      }
    } catch (error) {
      console.error("Error", error);
    }
  },
];
/**
 * getCustomers Function to fetch customer date
 * @param {JSON} req This Object contains the customer_id which is obtained from decoded payload of JSON Web Token.
 * @param {JSON} res This Object contains the customer data or an error message of server or database.
 */
exports.getCustomers = async (req, res) => {
  const cust_Id = req.cust_id;
  try {
    const cacheData = myCache.get(cust_Id);
    if (cacheData) {
      console.log("Customers data is retrieved from Cache");
      res.status(200).send(cacheData);
    } else {
      const customersData = await customers.getCustomers(cust_Id);
      myCache.set(cust_Id, customersData[0]);
      console.log("Customers data retrieved from data base");
      // console.log("customers are : ", customersData);
      res.status(200).send(customersData[0]);
    }
  } catch (error) {
    console.error("Error", error);
  }
};

/**
 * updateCustomer
 */
exports.updateCustomer = [
  bodyParser.json(),
  async (req, res) => {
    const cust_id = req.cust_id;
    // console.log(cust_id, " is customer id");
    // console.log(req.body.customer, " is customer data");
    let customer = req.body.customer;
    const result = await customers.updateCustomer(customer, cust_id);

    // console.log("result ", result);
    res.status(200).json(result);
  },
];

exports.addAddress = [
  bodyParser.json(),
  async (req, res) => {
    // console.log(req.body);
    const address = {
      houseNo: req.body.houseNo,
      street: req.body.street,
      city: req.body.city,
      state: req.body.state,
      country: req.body.country,
      postalcode: req.body.postalcode,
    };

    const cust_id = req.cust_id;

    const result = await customers.addAddress(address, cust_id);
    // clearing addresses from cache to update cache
    myCache.del("addresses");
    res.status(200).json(result);
  },
];

exports.getAddresses = async (req, res) => {
  const cust_id = req.cust_id;
  const cacheData = myCache.get("addresses");
  if (cacheData) {
    console.log("Addresses retrieved from cache");
    res.status(200).json(cacheData);
  } else {
    const result = await customers.getAddresses(cust_id);
    const response = {
      status: "sucess",
      addresses: result,
      message: "fetched all addresses",
    };
    myCache.set("addresses", response);
    console.log("Addresses retrieved from data base");
    res.status(200).json(response);
  }
};

exports.updateAddress = [
  bodyParser.json(),
  async (req, res) => {
    const address = req.body.address;
    const result = await customers.updateAddress(address);
    // clearing addresses from cache to update cache
    myCache.del("addresses");
    res.status(200).send(result);
  },
];

exports.deleteAddress = [
  bodyParser.json(),
  async (req, res) => {
    console.log(req.body.address_id, "delete address");
    const address_id = req.body.address_id;
    const result = await customers.deleteAddress(address_id);
    // clearing addresses from cache to update cache
    myCache.del("addresses");
    res.status(200).json({
      status: "sucess",
      data: result,
      message: "address deleted",
    });
  },
];

exports.orderItems = [
  bodyParser.json({ limit: "2mb" }),
  async (req, res) => {
    const products = req.body.products;
    const cust_id = req.cust_id;
    // console.log(products);

    // adding orders to oreders table
    const results = await Promise.all(
      products.map((product) => {
        return prodQueries.addOrders(
          product.product_id,
          cust_id,
          product.cart_item_quantity
        );
      })
    );

    // updating cart items
    const result = await Promise.all(
      products.map((product) => {
        return prodQueries.reduceProductQuantity(
          product.product_id,
          product.product_quantity,
          product.cart_item_quantity
        );
      })
    );

    // removing purchased cart items
    const cartResults = await Promise.all(
      products.map((product) => {
        return prodQueries.removeOrderedItems(product.cart_item_id, cust_id);
      })
    );

    console.log(results, `order table status`);
    console.log(result, "product quantity update status");
    console.log(cartResults, "cart items removed status");
    res.status(200).json({
      orderResult: results,
      productResult: result,
      cartResult: cartResults,
    });
  },
];

exports.orders = async (req, res) => {
  const cust_id = req.cust_id;
  const result = await customers.orders(cust_id);
  res.status(200).json(result);
};
