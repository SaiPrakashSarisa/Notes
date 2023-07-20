# JEST

Jest is a  JavaScript testing framework developed by Facebook. It was built on top of **Jasmine** (JavaScript testing framwork). It is a JavaScript library for creating, running and writing test.

Jest is widely used for unit testing of React and React Native applications, but it can also be used to validate almost everything around JavaScript. It is released as an NPM package and can be installed and run in any JavaScript project.


## Installation of Jest in Node.js
Run `npm install --save-dev jest` in your node project terminal. Now we can start writing our first test case by creating a file named same as the file which is to be tested with an extension `.test.js`.

Open `package.json` configuration file and change the test property's value as jest. 

```json
  
"scripts" : { "test" : "jest" }
  
```

## Test blocks, assertions and matchers

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




