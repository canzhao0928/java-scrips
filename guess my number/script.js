'use strict';
let secretNum = 18
let score = 20

document.querySelector(".check").addEventListener("click", function () {
    if (document.querySelector(".message").textContent !== "🎊 Correct! You WIN! 🎊") {
        const guess = Number(document.querySelector(".guess").value);
        if (!guess) {
            document.querySelector(".message").textContent = "🙅🏻‍♀️ no number";
        } else if (guess > 20 || guess < 1) {
            document.querySelector(".message").textContent = "Number should be between 1 and 20";
        } else if (guess !== secretNum) {
            if (score > 1) {
                document.querySelector(".message").textContent = guess > secretNum ? "📈 Too high!" : "📉 Too low!";
                score--;
                document.querySelector(".score").textContent = score;
            } else {
                document.querySelector(".message").textContent = "You lose..."
                document.querySelector(".score").textContent = 0;
            }
        } else if ((guess === secretNum)) {
            document.querySelector(".message").textContent = "🎊 Correct! You WIN! 🎊";
            document.querySelector(".number").textContent = guess;
            score++;
            document.querySelector(".score").textContent = score;
            document.querySelector("body").style.backgroundColor = "#60b347";
            document.querySelector(".number").style.width = "30rem";
            if (score > document.querySelector(".highscore").textContent) {
                document.querySelector(".highscore").textContent = score;
            }
        }
    }
});

document.querySelector(".again").addEventListener("click", function () {
    secretNum = Math.floor(Math.random() * 20) + 1;
    document.querySelector(".number").textContent = "?";
    document.querySelector(".message").textContent = "Start guessing...";
    document.querySelector(".guess").value = "";
    document.querySelector("body").style.backgroundColor = "#222";
    document.querySelector(".number").style.width = "15rem";
    score = 20
    document.querySelector(".score").textContent = score;

})
