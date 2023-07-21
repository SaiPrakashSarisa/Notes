const bodyParser = require("body-parser");
const NodeCache = require("node-cache");
const myCache = new NodeCache();

const getProducts = require("../util/MYSQL_QUERIES/get_products");

exports.products = async (req, res) => {
  console.log("inside products controller");
  try {
    const cachedData = myCache.get("products");
    if (cachedData) {
      console.log("products retrieved form cache");
      res.status(200).send(cachedData);
    } else {
      let products = await getProducts.products();
      const productImages = await getProducts.productImages();

      const allProducts = products.map((product) => {
        // console.log(product.product_id);
        const matchedProduct = productImages.find(
          (image) => product.product_id === image.product_id
        );
        if (matchedProduct) {
          const buffer = Buffer.from(matchedProduct.image_file);
          const stringData = buffer.toString("utf-8");
          return { ...product, image: stringData };
        }
      });
      console.log("Products retrieved from data base");
      myCache.set("products", allProducts);
      res.status(200).send(allProducts);
    }
  } catch (err) {
    res.status(500).send("no data");
  }
};

exports.product = [
  bodyParser.json(),
  async (req, res) => {
    // console.log('selecte item is ', req.body.id);
    try {
      const cacheData = myCache.get("selectedProduct");
      if (cacheData) {
        console.log("Selected Product data is retrieved form cache");
        res.status(200).json(cacheData);
      } else {
        const productData = await getProducts.selectedPorduct(req.body.id);
        const items = productData.map((product) => {
          const buffer = Buffer.from(product.image_file);
          const stringData = buffer.toString("utf-8");
          return { ...product, image: stringData };
        });
        myCache.set("selectedProduct", items);
        console.log("Selected Product data is retrieved form data base");
        res.status(200).json(items);
      }
    } catch (err) {
      res.status(500).send("no data");
    }
  },
];
