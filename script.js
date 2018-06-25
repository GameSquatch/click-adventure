let overMenu, overMenuWidth;

$(document).ready(() => {
    overMenu = $("#overMenu");
    overMenuWidth = parseInt(overMenu.css("width"));
    overMenu.css("height", window.innerHeight);
    overMenu.css("left", -overMenuWidth);
});

function toggleMenu() {
    let w = parseInt(overMenu.css("left"));

    if (w !== 0) {
        overMenu.css("left", 0);
    }
    else {
        overMenu.css("left", -overMenuWidth);
    }
}