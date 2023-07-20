# JEST

Jest is a  JavaScript testing framework developed by Facebook. It was built on top of **Jasmine** (JavaScript testing framwork). It is a JavaScript library for creating, running and writing test.

Jest is widely used for unit testing of React and React Native applications, but it can also be used to validate almost everything around JavaScript. It is released as an NPM package and can be installed and run in any JavaScript project.


## Installation of Jest in Node.js
Run `npm install --save-dev jest` in your node project terminal. Now we can start writing our first test case by creating a file named same as the file which is to be tested with an extension `.test.js`.

Open `package.json` configuration file and change the test property's value as jest. 

```json
  
"scripts" : { "test" : "jest" }
  
```

## First test with Jest

We will create a simple JavaScript function code for adding 2 numbers and write a corresponding Jest-based test for this function.

create a file named `sum.js` and write the following code

```js
  
function sum(a, b) {
  return a + b;
}

// exporting our sum function 
module.exports = sum;
  
```

Now, for testing, create a test file with the name `sum.test.js`.

```js

// import your sum function
const sum = require('./sum');

test("adding 1 and 2 expect to be 3",() => {
  expect(sum(1,2)).toBe(3);
});
  
```

In this file we have a written test to add 2 numbers and verify the expected result. We have provided the numbers 1 and 2, and expect 3 to be output.

`test` is a function requires two parameters : first one is a string to describe the test block, and second one is a callback function in which we wrapped our actual test.

`expect` is a function requires a parameter, which is the function to be tested. Along with this function a matcher function `toBe` is used to check whether the calculation result of the function meets the expectations.

### Run our first test

Run the following command in your terminal to run our test file.

```bash
npm test sum.test.js
```

The above command run only our sum.test.js file. If we want to run all the test files, run the following command.

```bash
npm test
```

## Writing test case for a controller in Node.js project
I have controller named `customerData.js` as shown below :

```js

const { getCustomers } = require("./getCustomerQuery");

async function customerData(req, res) {
  const cust_Id = req.cust_Id;

  const customerInfo = await getCustomers(cust_Id);

  res.status(200).send(customerInfo);
}

module.exports = { customerData };
  
```

In this we have a function `customerData(req, res)`, which takes two parameters `request` and `response`. In the request object we have property `cust_Id`, and we are passign this cust_Id to a util function `getCustomers(cust_Id)` and this method is going to return the data of the given customer id. And we are sending the response back to client with the a status code of 200.

```js

// importig mysql
const mysql = require("mysql");
require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

// establising connection
connection.connect((err) => {
  if (err) {
    console.error("Error Connectiong To MYSQL Data Base..", err);
    return;
  } else {
    console.log("Connected to MYSQL DATABASE SUCESS");
  }
});

function getCustomers(cust_Id) {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM customers WHERE cust_Id = ?",[cust_Id],
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
};

module.exports = { getCustomers };
```
The above code is the impementation of the `getCustomers` function. Now we have to write a test case to check whether our controller is returning customer data or not.
Let's create a file with name `customerData.test.js`.

1. Import the customerData  and getCustomers functions in the test file.
```js

// controller function
const { customerData } = require("./customerData");
// utill function
const { getCustomers } = require("./getCustomerQuery"); 
```

2. Now lets write the test method with some assertions and matchers

```js

test('Should return customer information', async () => {
  //creating a dummy request object
  const request = {
    cust_Id : '1234'
  };

  //creating a dummy response object
  const response = {
    status : jest.fn().mockReturnThis(),
    send : jest.fn()
  }

  // calling our customerData function with out dummy req and res objects
  await customerData(request, response);
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.status).toHaveBeenCalledTImes(1);
  expect(res.send).toHaveBeenCalledWith([{
    cust_id: "1234",
    cust_name: "Michael",
  }])

})
```

Now if we run this test file our code tries to connect to data base and executes the query.But I haven't installed mysql node package in my project so we will get any error and out test case get fails. When we do testing we don't and we should not call any funtions, insted of that we make use of `Mock` functions.

```bash
 FAIL  fetchcustomers/customerData.test.js
  ● Test suite failed to run

    Cannot find module 'mysql' from 'fetchcustomers/getCustomerQuery.js'

    Require stack:
      fetchcustomers/getCustomerQuery.js
      fetchcustomers/customerData.js
      fetchcustomers/customerData.test.js

    > 1 | const mysql = require("mysql");
        |                               ^
      2 |
      3 | const connection = mysql.createConnection({
      4 |   host: "host",

      at Resolver._throwModNotFoundError (node_modules/jest-resolve/build/resolver.js:427:11)
      at Object.<anonymous> (fetchcustomers/getCustomerQuery.js:1:31)
      at Object.require (fetchcustomers/customerData.js:1:26)
      at Object.require (fetchcustomers/customerData.test.js:1:26)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        0.913 s, estimated 1 s
Ran all test suites matching /customerData.test.js/i.
```

3. Create a mock function to replicate the getCustomers function on top of the test method.

```js
jest.mock("./getCustomerQuery", () => ({
  getCustomers: jest.fn().mockResolvedValue([
    {
      cust_id: "1234",
      cust_name: "Michael",
    },
  ]),
}));
```

Now if we run the test with command `npm test customerData.test.js` and our test will get passed.

```bash
 PASS  fetchcustomers/customerData.test.js
  √ should retrieve data form the data base and send status code as 200 (4 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        0.466 s, estimated 1 s
Ran all test suites matching /customerData.test.js/i.
```


### [JEST Cheat Sheets](https://devhints.io/jest) 










