function eval() {
  // Do not use eval!!!
  return;
}

const prior = {
  "(": 0,
  "+": 1,
  "-": 1,
  "*": 2,
  "/": 2
};

const func = {
  "+": (a, b) => a + b,
  "-": (a, b) => a - b,
  "*": (a, b) => a * b,
  "/": (a, b) => {
    if (b === 0) throw Error("TypeError: Division by zero.");
    return a / b;
  }
};

function normalizeArr(arr) {
  const normalizeArr = [];
  for (let i = 0; i <= arr.length - 1; i++) {
    if (arr[i].match(/[0-9]/)) {
      const tmp = normalizeArr.pop();
      if (tmp && tmp.match(/[0-9]/)) {
        normalizeArr.push(tmp + arr[i]);
      } else {
        if (tmp) {
          normalizeArr.push(tmp);
        }
        normalizeArr.push(arr[i]);
      }
    } else {
      normalizeArr.push(arr[i]);
    }
  }
  return normalizeArr;
}

function createRPN(normalize) {
  let opStack = [];
  let resultStack = [];
  normalize.forEach(element => {
    if (element.match(/[0-9]/)) {
      resultStack.push(Number(element));
    } else if (element === "(") {
      opStack.push(element);
    } else if (element === ")") {
      let operand = opStack.pop();
      while (operand !== "(") {
        resultStack.push(operand);
        operand = opStack.pop();
      }
    } else if (element.match(/[\\+-\\*/]/)) {
      for (let i = opStack.length - 1; i >= 0; i--) {
        if (opStack[i] && prior[opStack[i]] >= prior[element]) {
          resultStack.push(opStack.pop());
        } else break;
      }
      opStack.push(element);
    }
  });
  while (opStack.length !== 0) {
    resultStack.push(opStack.pop());
  }
  return resultStack;
}

function expressionCalculator(expr) {
  if (expr.split("(").length !== expr.split(")").length)
    throw Error("ExpressionError: Brackets must be paired");
  const normalize = normalizeArr(expr.split("").filter(item => item !== " "));
  const rpn = createRPN(normalize);
  const resultStack = [];
  rpn.forEach(element => {
    if (typeof element === "number") {
      resultStack.push(element);
    } else {
      const b = resultStack.pop();
      const a = resultStack.pop();
      const result = func[element](a, b);
      resultStack.push(result);
    }
  });
  return resultStack[0];
}

module.exports = {
  expressionCalculator
};
