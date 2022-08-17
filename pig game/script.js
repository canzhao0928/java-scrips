'use strict';

let currenPlayer = 0;
let isPlay = true;

function changPlayer() {
    document.querySelector(`#current--${currenPlayer}`).textContent = 0;
    currenPlayer = currenPlayer === 0 ? 1 : 0;
    document.querySelector(".player--0").classList.toggle('player--active');
    document.querySelector(".player--1").classList.toggle('player--active');
}

// init data
function init() {
    currenPlayer = 0;
    document.querySelector("#current--0").textContent = 0;
    document.querySelector("#current--1").textContent = 0;
    document.querySelector("#score--0").textContent = 0;
    document.querySelector("#score--1").textContent = 0;
    document.querySelector(".player--0").classList.remove("player--active");
    document.querySelector(".player--1").classList.add("player--active");
    document.querySelector(".player--0").classList.remove("player--winner");
    document.querySelector(".player--1").classList.remove("player--winner");
    isPlay = true;

}
init();

//roll dice to generate a number and update the img.
document.querySelector(".btn--roll").addEventListener("click", function () {
    if (isPlay) {
        const num = Math.floor(Math.random() * 6) + 1;
        document.querySelector(".dice").setAttribute("src", 'dice-' + num + '.png');
        if (num === 1) {
            //clear current score and change player
            changPlayer();
        } else {
            //add to current score
            let playerCurrentScore = Number(document.querySelector(`#current--${currenPlayer}`).textContent) + num;
            document.querySelector(`#current--${currenPlayer}`).textContent = playerCurrentScore;
        }
    }

})

//change player hold and update score
document.querySelector(".btn--hold").addEventListener("click", function () {
    if (isPlay) {
        //update scores
        let playerScore = Number(document.querySelector(`#score--${currenPlayer}`).textContent);
        playerScore += Number(document.querySelector(`#current--${currenPlayer}`).textContent);
        if (playerScore >= 10) {
            document.querySelector(`#score--${currenPlayer}`).textContent = "🎉  WIN";
            document.querySelector(`.player--${currenPlayer}`).classList.add("player--winner");
            document.querySelector(`.player--${currenPlayer}`).classList.remove("player--active");
            isPlay = false;
        } else {
            document.querySelector(`#score--${currenPlayer}`).textContent = playerScore;
        }
        //change player
        changPlayer();
    }
})


document.querySelector(".btn--new").addEventListener("click", function () {
    init();
})

