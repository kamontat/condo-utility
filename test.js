const testcase = [{
  n: 10,
  r: 32.66
}, {
  n: 15,
  r: 44.60
}, {
  n: 20,
  r: 59.96
}, {
  n: 40,
  r: 127.53
}, {
  n: 41,
  r: 131.28
}, {
  n: 50,
  r: 165.07
}, {
  n: 75,
  r: 258.90
}, {
  n: 101,
  r: 356.58
}, {
  n: 123,
  r: 441.34
}, {
  n: 134,
  r: 483.74
}, {
  n: 150,
  r: 545.39
}, {
  n: 151,
  r: 548.03
}, {
  n: 200,
  r: 763.31
}, {
  n: 250,
  r: 982.97
}, {
  n: 300,
  r: 1202.63
}, {
  n: 301,
  r: 1207.01
}]

const rules = {
  "ft": -0.116,
  "high": {
    "150": 3.2484,
    "400": 4.2218,
    "2000": 4.4217,
    "service": 38.22
  },
  "low": {
    "15": 2.3488,
    "25": 2.9882,
    "35": 3.2405,
    "100": 3.6237,
    "150": 3.7171,
    "400": 4.2218,
    "2000": 4.4217,
    "service": 8.19
  }
}

const calculate = (unit) => {
  const rule = unit > 150 ? rules.high : rules.low
  const service = rule.service;
  const condition = {
    ...rule
  }
  delete condition.service;

  let price = 0
  let previous = 0
  for (let key in condition) {
    const number = parseInt(key, 10)
    const rate = condition[key]

    if (unit <= number) {
      price += (unit - previous) * rate
      break // terminate condition
    } else {
      price += (number - previous) * rate
      previous = number
    }
  }

  const base = (price + service)
  const ft = unit * rules.ft
  const final = base + ft
  const vat = final * 7 / 100 // 7%
  return (final + vat).toFixed(2)
}

testcase.forEach(c => {
  const res = calculate(c.n)
  if (c.r.toFixed(2) !== res)
    console.log(`NO MATCHES (${c.r} !== ${res})`);
  else
    console.log(`MATCHES (${c.r} === ${res})`);
})