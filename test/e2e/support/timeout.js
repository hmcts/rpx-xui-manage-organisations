// timeout.js
var { setDefaultTimeout } = require("cucumber");
console.log("******************* Defaily timeout ");
setDefaultTimeout(600 * 1000);
// this timeout value is global setting impact all step definition function,
// thus it doesn't means the value is more large more better.