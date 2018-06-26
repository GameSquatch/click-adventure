let overMenu, overMenuWidth;
let bars;
let intervals = {};
let player;
let coinCount;

$(document).ready(() => {
    overMenu = $("#overMenu");
    overMenuWidth = parseInt(overMenu.width());
    overMenu.css("height", window.innerHeight);
    overMenu.css("left", -overMenuWidth);

    bars = $(".progressor");
    coinCount = $("#coinCount");
    // bars = document.getElementsByClassName("progressor");
    player  = new Player();
});

function toggleMenu() {
    // here we get the integer value of the menu's left position
    let lf = parseInt(overMenu.css("left"));

    // if the menu's left position is not 0, it is already out,
    // so make it zero
    if (lf !== 0) {
        overMenu.css("left", 0);
    }
    else {
        // else make the left position equal to the negative value
        // of the menu's width, which is off the screen
        overMenu.css("left", -overMenuWidth);
    }
}

function actionGo(barNum) {
    // bars[barNum].style.width = "75%";
    // $(bars[barNum]).width("75%");
    let w = 0;

    if (!intervals[barNum]) {
        intervals[barNum] = setInterval(fill, 10);
    }

    function fill() {
        // if the bar has been completed:
        if (w >= 100) {
            // clear the interval for the bar that is complete
            // and set it equal to null
            clearInterval(intervals[barNum]);
            intervals[barNum] = null;
            // set the bar back to a starting width of 0
            $(bars[barNum]).width("0%");
            
            coinCount.html(parseInt(coinCount.text()) + player.skillValues[barNum]);
        }
        else {// else increment the progress using the player's rates
            w += player.skillRates[barNum];
            $(bars[barNum]).width(`${w}%`);
        }
    }
}

function Player() {
    this.skillRates = [0.3, 0.22, 0.14];
    this.skillValues = [2, 4, 7];
}

window.addEventListener("resize", (event) => {
    overMenuWidth = parseInt(overMenu.width());
    overMenu.css("left", -overMenuWidth);
});