'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');


function displaymovement(movs, sort = false) {
  containerMovements.innerHTML = "";

  const movements = sort ? movs.slice().sort((a, b) => a - b) : movs
  movements.forEach((move, i) => {
    const html = `<div class="movements__row">
                  <div class="movements__type movements__type--${move > 0 ? "deposit" : "withdrawal"}">${i} ${move > 0 ? "deposit" : "withdrawal"}</div>
                  <div class="movements__value">${move}€</div>
                </div>`
    containerMovements.insertAdjacentHTML("afterbegin", html)
  });
}

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((p, c) => p + c)
  labelBalance.textContent = `${acc.balance}€`
}



const calcDisplaySummary = function (acc) {
  const deposit = acc.movements.filter(value => value > 0).reduce((p, c) => p + c);
  const withdrawal = acc.movements.filter(value => value < 0).reduce((p, c) => p + c);
  const interest = acc.movements.filter(value => value > 0).map(deposit => deposit * acc.interestRate / 100).filter(int => int >= 1).reduce((p, c) => p + c);
  labelSumIn.textContent = `${deposit}€`;
  labelSumOut.textContent = `${Math.abs(withdrawal)}€`;
  labelSumInterest.textContent = `${interest}€`;
}

let sort = false
btnSort.addEventListener("click", (event) => {
  event.preventDefault();
  sort = !sort;
  displaymovement(currentAccount.movements, sort);
})

const updateUI = function (acc) {
  displaymovement(acc.movements);
  calcDisplayBalance(acc);
  calcDisplaySummary(acc);
}

// const username = account1.owner.toLowerCase().split(" ").map(name => name[0]).join("")
// console.log(username);

const generateUsername = function (accs) {
  accs.forEach(account => account.username = account.owner.toLowerCase().split(" ").map(name => name[0]).join(""))
}

generateUsername(accounts)
// console.log(accounts);

let currentAccount

btnLogin.addEventListener("click", (e) => {
  e.preventDefault();
  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value)
  if (currentAccount?.pin === +inputLoginPin.value) {
    //updata UI
    updateUI(currentAccount)
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(" ")[0]}`;
    containerApp.setAttribute("style", "opacity: 1");
    inputLoginUsername.value = "";
    inputLoginPin.value = "";
    //blur cursor
    inputLoginPin.blur();
  }

})


btnTransfer.addEventListener("click", (e) => {
  e.preventDefault();
  const receiveAcc = accounts.find(acc => acc.username === inputTransferTo.value)
  const amount = +inputTransferAmount.value
  //clear the transfer data
  inputTransferTo.value = "";
  inputTransferAmount.value = "";
  // check transfer valid
  if (amount > 0 && receiveAcc && receiveAcc !== currentAccount && currentAccount.balance >= amount) {
    //do the transfer
    receiveAcc.movements.push(+amount)
    currentAccount.movements.push(-amount)
    //update the current account
    updateUI(currentAccount)

  }
})

btnLoan.addEventListener("click", (event) => {
  event.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov > amount * 0.1)) {
    //update movements
    currentAccount.movements.push(amount);
    console.log(currentAccount);
    //update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = "";
})

btnClose.addEventListener("click", (event) => {
  event.preventDefault();
  if (currentAccount.pin === Number(inputClosePin.value) && currentAccount.username === inputCloseUsername.value) {
    accounts.splice(accounts.findIndex(acc => acc === currentAccount), 1)
    //hidde UI
    containerApp.setAttribute("style", "opacity: 0");
    inputCloseUsername.value = "";
    inputClosePin.value = "";
  }
})

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const deposit = movements.filter(value => value > 0).map(value => value * 1.1).reduce((p, c) => p + c)
// console.log(deposit);

/////////////////////////////////////////////////


const allmovement = [];
accounts.forEach((acc) => { allmovement.push(acc.movements) })

console.log(allmovement.flat());