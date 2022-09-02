'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2022-08-31T23:36:17.929Z',
    '2022-09-01T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];
// Data
// const account1 = {
//   owner: 'Jonas Schmedtmann',
//   movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
//   interestRate: 1.2, // %
//   pin: 1111,
// };

// const account2 = {
//   owner: 'Jessica Davis',
//   movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
//   interestRate: 1.5,
//   pin: 2222,
// };

// const account3 = {
//   owner: 'Steven Thomas Williams',
//   movements: [200, -200, 340, -300, -20, 50, 400, -460],
//   interestRate: 0.7,
//   pin: 3333,
// };

// const account4 = {
//   owner: 'Sarah Smith',
//   movements: [430, 1000, 700, 50, 90],
//   interestRate: 1,
//   pin: 4444,
// };

// const accounts = [account1, account2, account3, account4];

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

function formateMovementsDate(date, locale) {
  const daysPassed = Math.floor(Math.abs(new Date() - date) / (1000 * 60 * 60 * 24))
  if (daysPassed === 0) return "Today"
  // less than 24 hours but anohter day,this function
  if (daysPassed === 1) return "Yesterday"
  if (daysPassed <= 7) return `${daysPassed} days ago`
  else {
    return date.toLocaleString(locale, { year: 'numeric', month: 'numeric', day: 'numeric' })
  }
}

function displaymovement(acc, sort = false) {
  containerMovements.innerHTML = "";

  const movements = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements
  movements.forEach((move, i) => {
    const options = {
      style: "currency",
      currency: acc.currency
    }
    const formateMovement = new Intl.NumberFormat(acc.locale, options).format(move)
    const date = formateMovementsDate(new Date(acc.movementsDates[i]), acc.locale);
    const html = `<div class="movements__row">
                  <div class="movements__type movements__type--${move > 0 ? "deposit" : "withdrawal"}">${i} ${move > 0 ? "deposit" : "withdrawal"}</div>
                  <div class="movements__date">${date}</div>
                  <div class="movements__value">${formateMovement}</div>
                </div>`
    containerMovements.insertAdjacentHTML("afterbegin", html)
  });
}

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((p, c) => p + c)
  labelBalance.textContent = `${acc.balance.toFixed(2)}€`
}



const calcDisplaySummary = function (acc) {
  const deposit = acc.movements.filter(value => value > 0).reduce((p, c) => p + c);
  const withdrawal = acc.movements.filter(value => value < 0).reduce((p, c) => p + c);
  const interest = acc.movements.filter(value => value > 0).map(deposit => deposit * acc.interestRate / 100).filter(int => int >= 1).reduce((p, c) => p + c);
  labelSumIn.textContent = `${deposit.toFixed(2)}€`;
  labelSumOut.textContent = `${Math.abs(withdrawal).toFixed(2)}€`;
  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
}

let sort = false
btnSort.addEventListener("click", (event) => {
  event.preventDefault();
  sort = !sort;
  displaymovement(currentAccount, sort);
})

const updateUI = function (acc) {
  displaymovement(acc);
  calcDisplayBalance(acc);
  calcDisplaySummary(acc);
}
let timer = false;

function startTimer(params) {
  if (timer) {
    console.log(timer);
    clearInterval(timer)
  }

  const countdown = function () {
    // different method to set two - digit
    labelTimer.textContent = `${Math.floor(startTime / 60).toLocaleString('en-US', {
      minimumIntegerDigits: 2,
      useGrouping: false
    })}:${String(startTime % 60).padStart(2, 0)}`

    if (startTime === 0) {
      labelWelcome.textContent = 'Log in to get started';
      containerApp.setAttribute("style", "opacity: 0");
      clearInterval(timer)
    }
    startTime--

  }

  let startTime = 300
  countdown()
  timer = setInterval(countdown, 1000);
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
    //update time
    labelDate.textContent = new Date().toLocaleString(currentAccount.locale);
    //blur cursor
    inputLoginPin.blur();

    //start the timer
    startTimer()

  }

})


btnTransfer.addEventListener("click", (e) => {
  e.preventDefault();
  const receiveAcc = accounts.find(acc => acc.username === inputTransferTo.value)
  const amount = (+inputTransferAmount.value).toFixed(2)
  //clear the transfer data
  inputTransferTo.value = "";
  inputTransferAmount.value = "";
  // check transfer valid
  if (amount > 0 && receiveAcc && receiveAcc !== currentAccount && currentAccount.balance >= amount) {
    //do the transfer
    receiveAcc.movements.push(+amount)
    receiveAcc.movementsDates.push(new Date())
    currentAccount.movements.push(-amount)
    currentAccount.movementsDates.push(new Date())
    //update the current account
    updateUI(currentAccount)
    startTimer()

  }
})

btnLoan.addEventListener("click", (event) => {
  event.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov > amount * 0.1)) {
    //after 2.5s
    setTimeout(() => {
      //update movements
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date());
      //update UI
      updateUI(currentAccount);
    }, 2500)
  }
  inputLoanAmount.value = "";
  startTimer()
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


// const allmovement = [];
// accounts.forEach((acc) => { allmovement.push(acc.movements) })

// console.log(allmovement.flat());