const logger = require('../../functions/logger.js');

module.exports.info = {
  name: 'subtract',
  aliases: ['sub'],
  category: "utility",
  minArgs: 3,
  description: 'Subtract numbers in different number systems',
  usage: 'subtract <base> <minuend> <subtrahend>'
};

module.exports.run = async (client, msg, args) => {
  let base = getBase(args[0].toLowerCase());

  if (!base || base > 36 || base < 0) {
    return msg.channel.send({
      content: `${args[0]} is not a valid base\nOnly bases 1 to 36, inclusive are supported`
    }).then(() => logger.logFailedCmd(client, msg));
  };

  let numArr = [args[1].toUpperCase(), args[2].toUpperCase()];
  if (!verifyNumbers(numArr, base)) {
    return msg.channel.send({
      content: `The given numbers are invalid for the given base`
    }).then(() => logger.logFailedCmd(client, msg));
  }

  let normalizedNums = getNormalizedNums(numArr);
  let num1 = normalizedNums[0];
  let num2 = normalizedNums[1];
  let dotIndex = normalizedNums[2];

  let result = subtract(num1, num2, base, dotIndex);
  console.log(result);

  msg.channel.send({
    content: `Subtracting ${base}-based \`${numArr[1]}\` from \`${numArr[0]}\``
  }).then((m) => {
    m.edit({
      content: `Subtracting ${base}-based \`${numArr[1]}\` from \`${numArr[0]}\`\nThe result is \`${result}\``
    });
  });
  logger.logSuccessfulCmd(client, msg);
};

// Determines the base of the given numbers
const getBase = (base) => {
  if (Boolean(Number(base))) {
    // if the given base is a pure number, sets it as the base
    base = Number(base);
  } else {
    // if the given base is b(inary), o(ctal), d(decimal) or h(exadecimal), sets the base as 2, 8, 10, 16 respectively
    switch (base[0]) {
      case "b":
        base = 2;
        break;
      case "o":
        base = 8;
        break;
      case "d":
        base = 10;
        break;
      case "h":
        base = 16;
        break;
      default:
        // returns null as the base if the given base is invalid
        base = null;
    };
  };

  // returns the base of the numbers
  return base;
};

// // Determines if the given numbers are valid
const verifyNumbers = (nums, base) => {
  let validChars = ["."];

  // adds digits as valid characters as required
  for (let i = 0; i < 10 && i < base; i++) validChars.push(i.toString());

  // adds letters as valid characters as required
  if (base > 10) {
    for (let i = 10; i < base; i++) validChars.push(String.fromCharCode(55 + i))
  };

  // checks if all the characters in the numbers are valid
  let valid = true;
  for (let i = 0; i < 2; i++) {
    let num = nums[i];
    for (let j = 0; j < num.length; j++) {
      if (!validChars.includes(num[j])) {
        valid = false;
      };
    };
  };

  // returns if the given numbers are valid or not
  return valid;
};

// // Normalizes the two numbers to have a similar structure
const getNormalizedNums = (numArr) => {
  let dot = new RegExp(/\./);
  let dotIndex = 0;

  // adds a '.00' to the end if absent
  if (!dot.test(numArr[0])) numArr[0] += '.00';
  if (!dot.test(numArr[1])) numArr[1] += '.00';

  // stores the position of the dot
  if (numArr[0].indexOf('.') > numArr[1].indexOf('.')) dotIndex = numArr[0].indexOf('.')
  else dotIndex = numArr[1].indexOf('.')

  // splits the number at the '.' to get integer and decimal parts
  let num1 = numArr[0].split(/\./);
  let num2 = numArr[1].split(/\./);

  // adds leading and trailing 0's to the integer and decimal part respectively to generalize their digit counts
  for (let i = 0; i < 2; i++) {
    while (num1[i].length !== num2[i].length) {
      if (num1[i].length < num2[i].length) {
        if (i === 0) num1[i] = '0' + num1[i];
        else num1[i] = num1[i] + '0';
      } else {
        if (i === 0) num2[i] = '0' + num2[i];
        else num2[i] = num2[i] + '0';
      };
    };
  };

  // returns an array of two generalized numbers and the position of the '.'
  return [num1.join(''), num2.join(''), dotIndex];
};

// Subtracts N-based num2 from num1 and determines a result, including the correct placement of '.'
const subtract = (num1, num2, base, dotIndex) => {
  let resultArr = [];
  let carry = 0;

  // loops through the numbers' digits and gets their difference
  for (let i = num1.length - 1; i >= 0; i--) {
    // determines d1,d2 in case of numbers
    let d1 = Number(num1[i]);
    let d2 = Number(num2[i]);

    // determines d1,d2 in case of letters
    if (!(d1 >= 0)) d1 = Number(num1[i].charCodeAt(0) - 55);
    if (!(d2 >= 0)) d2 = Number(num2[i].charCodeAt(0) - 55);

    // handles all the calculations
    let diff = 0;
    if (d1 < (d2 + carry)) {
      diff = (d1 + base) - (d2 + carry);
      carry = 1;
      if (diff < 10) resultArr.unshift(diff);
      else resultArr.unshift(String.fromCharCode(diff + 55));
    } else {
      diff = d1 - (d2 + carry)
      carry = 0;
      if (diff < 10) resultArr.unshift(diff);
      else resultArr.unshift(String.fromCharCode(diff + 55));
    };
  };

  // converts the resultArr array into a proper result including the correct position of '.'
  let result = '';
  for (let i = 0; i < num1.length; i++) {
    if (i === dotIndex) result += `.${resultArr[i].toString()}`
    else result += resultArr[i].toString();
  };

  // returns the result of subtraction as a string
  return result;
};
