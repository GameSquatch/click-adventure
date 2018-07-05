let overMenu, overMenuWidth;
let invTitles, invCounts, levels;
let bars, xpBars;
let intervals = {};
let player;
let coinCount;

$(document).ready(() => {
    overMenu = $("#overMenu");
    invTitles = $("#invTitles");
    invCounts = $("#invCounts")
    levels = $("#levels");
    overMenuWidth = parseInt(overMenu.width());
    overMenu.css("height", window.innerHeight);
    overMenu.css("left", -overMenuWidth);

    bars = $(".progressor");
    xpBars = $(".xpProgressor");
    coinCount = $("#coinCount");
    // bars = document.getElementsByClassName("progressor");
    player  = new Player();
    player.updateInventory();
    player.updateLevels();
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
    let xpW = parseInt(xpBars[barNum].style.width);
    if (!xpW) xpW = 0;

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
            
            // complete all processes update coins, levels, etc
            player.finishProgressBar(barNum);

            xpW = player.updateXP(barNum, xpW);
            // needs to be after the player.finishProgressBar func
            $(xpBars[barNum]).css("width", `${xpW}%`);

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
    this.skillLevels = {
        "Farming": 1,
        "Fighting": 1,
        "Spell Casting": 1
    };
    this.xpRates = [15, 20, 30];
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

    this.finishProgressBar = function(barNum) {
        this.addCoins(barNum);
        this.checkDrops(barNum);
    }

    this.droppedItem = function(dropChance) {
        if (Math.random() * 100 + 1 <= dropChance) {
            return true;
        }

        return false;
    }

    this.updateInventory = function() {
        let keys = Object.keys(this.inventory);
        let titles = "", counts = "";

        for (let i = 0; i < keys.length; ++i) {
            titles += keys[i] + "<br/>";// + "" + this.inventory[keys[i]] + "<br/>";
        }
        invTitles.html(titles);

        for (let i = 0; i < keys.length; ++i) {
            counts += this.inventory[keys[i]] + "<br/>";
        }
        invCounts.html(counts);
    }

    this.updateLevels = function() {
        let keys = Object.keys(this.skillLevels);
        let html = "";
        for (let i = 0; i < keys.length; ++i) {
            html += keys[i] + ": " + this.skillLevels[keys[i]] + "<br/>";
        }
        levels.html(html);
    }

    this.addCoins = function(barNum) {
        this.coinCount += this.skillValues[barNum];
        coinCount.html(this.coinCount);
    }

    this.updateXP = function(barNum, xp) {
        xp += this.xpRates[barNum];

        if (xp  >= 100) {
            xp -= 100;
            this.skillLevels[Object.keys(this.skillLevels)[barNum]]++;
            this.updateLevels();
        }
        return xp;
    }

    this.checkDrops = function(barNum) {
        // if dropped a rare item
        if (this.droppedItem(this.itemChances[barNum][1])) {
            // add a rare item to inventory
            this.inventory[this.items[barNum][1]]++;
            // play the animation
            itemFoundAnimation(barNum, 1);
            // update the html
            player.updateInventory();
        }
        //else if dropped a common item
        else if (this.droppedItem(this.itemChances[barNum][0])) {
            this.inventory[this.items[barNum][0]]++;
            itemFoundAnimation(barNum, 0);
            this.updateInventory();
        }
    }
}

function itemFoundAnimation(barNum, rarity) {
    let itemName = player.items[barNum][rarity];
    let itemhtml = `<div style="bottom:0;left:0" class="itemAnimation" id="itemAnimation-${barNum}">Found 1 ${itemName}!</div>`;
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
            newElem.remove();
            newElem = null;
            clearInterval(anim);
        }
    }
}

window.addEventListener("resize", (event) => {
    overMenuWidth = parseInt(overMenu.width());
    overMenu.css("left", -overMenuWidth);
});


