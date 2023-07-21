const express = require("express");
const cors = require("cors");
const app = express();
const router = express.Router();
require("dotenv").config();

app.use(cors());
// import routes
require("./src/routes/routes")(app, router);

let port = process.env.PORT;
console.log(port);
app.listen(port, () => {
  console.log("server started on port: " + port);
});
