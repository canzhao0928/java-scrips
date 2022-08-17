'use strict';

let currenPlayer = 0;

//caculate players score in one round
function updateScore(currenPlayer) {

    let playerScore = Number(document.querySelector(`#score--${currenPlayer}`).textContent);
    playerScore += Number(document.querySelector(`#current--${currenPlayer}`).textContent);
    if (playerScore >= 100) {
        document.querySelector(`#score--${currenPlayer}`).textContent = "🎊 WIN 🎊";
    } else {
        document.querySelector(`#score--${currenPlayer}`).textContent = playerScore;
    }
    document.querySelector(`#current--${currenPlayer}`).textContent = 0;

}


//roll dice to generate a number and update the img.
document.querySelector(".btn--roll").addEventListener("click", function () {
    const num = Math.floor(Math.random() * 6) + 1;
    console.log(num);
    document.querySelector(".dice").setAttribute("src", 'dice-' + num + '.png');
    if (num === 1) {
        //clear current score
        currenPlayer === 0 ? document.querySelector("#current--0").textContent = 0 : document.querySelector("#current--1").textContent = 0;
        //change player by number
        currenPlayer = currenPlayer === 0 ? 1 : 0;
        document.querySelector("#current--0").classList.toggle('player--active');
        document.querySelector("#current--1").classList.toggle('player--active');
    } else {
        //add to current score
        let playerCurrentScore = Number(document.querySelector(`#current--${currenPlayer}`).textContent) + num;
        document.querySelector(`#current--${currenPlayer}`).textContent = playerCurrentScore;
    }

})

//change player hold and update score
document.querySelector(".btn--hold").addEventListener("click", function () {
    //update scores
    updateScore(currenPlayer);
    //change player
    currenPlayer = currenPlayer === 0 ? 1 : 0;
    document.querySelector("#current--0").classList.toggle('player--active');
    document.querySelector("#current--1").classList.toggle('player--active');
})


document.querySelector(".btn--new").addEventListener("click", function () {
    document.querySelector("#current--0").textContent = 0;
    document.querySelector("#current--1").textContent = 0;
    document.querySelector("#score--0").textContent = 0;
    document.querySelector("#score--1").textContent = 0;
    document.querySelector("#current--1").classList.remove("player--active");
    currenPlayer = 0;
})