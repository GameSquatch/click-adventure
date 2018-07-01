let overMenu, overMenuWidth;
let bars, xpBars;
let intervals = {};
let player;
let coinCount;

$(document).ready(() => {
    overMenu = $("#overMenu");
    overMenuWidth = parseInt(overMenu.width());
    overMenu.css("height", window.innerHeight);
    overMenu.css("left", -overMenuWidth);

    bars = $(".progressor");
    xpBars = $(".xpProgressor");
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
    let xpW = parseInt($(xpBars[barNum]).css("width"), 10);
    // let xpW = xpBars[barNum].style.width;
    // if (xpW) xpW = parseInt(xpW, 10);
    console.log("xp bar width when clicked: ", xpW);

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
            $(bars[barNum]).css("width", "0%");
            
            xpW += player.xpRates[barNum];
            console.log("xpRate: ", player.xpRates[barNum]);
            console.log(`xpW + xpRate = ${xpW}`);
            if (xpW  > 100) {
                xpW = 0;
            }
            $(xpBars[barNum]).css("width", `${xpW}%`);
            // xpBars[barNum].style.width = xpW + "%";
            console.log("width after setting:", parseInt($(xpBars[barNum]).css("width"), 10));

            // update player's coin amount
            player.coinCount += player.skillValues[barNum];
            coinCount.html(player.coinCount);

            // if dropped a rare item, else if dropped common, add one to inventory
            if (player.droppedItem(player.itemChances[barNum][1])) {
                player.inventory[player.items[barNum][1]]++;
                itemFoundAnimation(barNum, 1);
            }
            else if (player.droppedItem(player.itemChances[barNum][0])) {
                player.inventory[player.items[barNum][0]]++;
                itemFoundAnimation(barNum, 0);
            }
        }// END if w >= 100
        else {// else increment the progress using the player's rates
            w += player.skillRates[barNum];
            // and set the width to the incrementing variable
            $(bars[barNum]).css("width", `${w}%`);
        }
    }
}

function Player() {
    this.skillRates = [0.3, 0.22, 0.14];
    this.skillValues = [2, 4, 7];
    this.xpRates = [25, 20, 15];
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
        [40, 11],
        [35, 29],
        [30, 25]
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

function itemFoundAnimation(barNum, rarity) {
    let itemName = player.items[barNum][rarity];
    let itemhtml = `<div class="itemAnimation" id="itemAnimation-${barNum}">Found 1 ${itemName}!</div>`;
    let itemElem = $(`#playArea .row:nth-child(${barNum + 1}) .progressBarContainer`);
    itemElem.append(itemhtml);
    let newElem = $(`#itemAnimation-${barNum}`);

    let anim = setInterval(itemNameMove, 10);

    // variables for the floating words physics
    let opacity = 1.0, y = 0, yv = 0.8, x = 0, xa = 0.02, xv = 0;
    function itemNameMove() {
        opacity -= 0.008;// decrease opacity each call
        yv *= 0.975;// y direction velocity dampening
        y += yv;// y position plus the velocity
        xa = (xv > 1.2 ? -0.01 : 0.02); // working on something different for this
        xv += xa;// velocity add accel
        x += xv;// position add velocity
        
        // the floating words are affected by opacity bottom (y pos) and left (x pos)
        newElem.css({"opacity": `${opacity}`, "bottom": `${y}px`, "left": `${x}px`});
        
        if (opacity <= 0.0) {// if opacity reaches zero, clear interval and remove div elem
            clearInterval(anim);
            newElem.remove();
        }
    }
}

window.addEventListener("resize", (event) => {
    overMenuWidth = parseInt(overMenu.width());
    overMenu.css("left", -overMenuWidth);
});