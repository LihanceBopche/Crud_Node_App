const fs = require("fs");

// console.log("Math value is",math.addFn(2, 5));
// console.log("Math value is",math.subFn(5, 3));

// fs.writeFileSync("./manthan.txt", "this is the My frist file");

const result = fs.readFileSync("./manthan.txt","utf-8");

console.log(result);