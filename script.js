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

            // update player's coin amount
            player.coinCount += player.skillValues[barNum];
            coinCount.html(player.coinCount);

            // drops special items
            if (player.droppedItem(player.itemChances[barNum][1])) {
                player.inventory[player.items[barNum][1]]++;
            }
            else if (player.droppedItem(player.itemChances[barNum][0])) {
                player.inventory[player.items[barNum][0]]++;
            }
        }
        else {// else increment the progress using the player's rates
            w += player.skillRates[barNum];
            // and set the width to the incrementing variable
            $(bars[barNum]).width(`${w}%`);
        }
    }
}

function Player() {
    this.skillRates = [0.3, 0.22, 0.14];
    this.skillValues = [2, 4, 7];
    this.coinCount = 0;
    this.inventory = {
        "Wheat": 0,
        "Starfruit": 0,
        "Sword": 0,
        "Power Ring": 0,
        "Wand": 0,
        "Rune Stone": 0
    };
    this.itemChances = [
        [20, 11],
        [15, 9],
        [10, 5]
    ];
    this.items = [
        ["Wheat", "Starfruit"],
        ["Sword", "Power Ring"],
        ["Wand", "Rune Stone"]
    ];

    this.droppedItem = function(dropChance) {
        if (Math.random() * 100 + 1 <= dropChance) {
            return true;
        }

        return false;
    }
}

window.addEventListener("resize", (event) => {
    overMenuWidth = parseInt(overMenu.width());
    overMenu.css("left", -overMenuWidth);
});