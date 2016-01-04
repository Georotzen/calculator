// global variables
var calcArr = [];
var total = 0;
var prevBtn;
var displayText = "";
var hasDec = false;

// cache jQuery selectors
var $display = $("#display");
var $history = $("#history");

function convertCalcArr(arr) {
    var s = "";
    var tempNum = "";
    var tempArr = [];
    for (var x = 0; x < arr.length; x++) {
        tempNum = arr[x];
        var end = tempNum.length - 1;
        if (tempNum.charCodeAt(end) === 45 && !isNaN(tempNum.charCodeAt(0))) {
            tempArr = tempNum.split("");
            tempArr.splice(-1);
            tempArr.unshift("-");
            arr[x] = tempArr.join("");
        }
        s += arr[x] + " ";
    }
    return s;
}

function displayHistory(arr) {
    var s = "";
    var tempNum = "";
    var tempArr = [];
    for (var x = 0; x < arr.length; x++) {
        tempNum = arr[x];
        if (tempNum.charCodeAt(0) === 45 && !isNaN(tempNum.charCodeAt(1))) {
            tempArr = tempNum.split("");
            tempArr.splice(0, 1);
            tempArr.push("-");
            arr[x] = tempArr.join("");
        }
        s += arr[x] + " ";
    }
    s = s.split(/\s/g).reverse().join(' ');
    $history.text(s);
}

function buttonActions(btn) {
    displayText = $display.text();

    if (displayText.charCodeAt(0) === 46) {
        displayText = "0" + displayText;
        $display.text(displayText);
    }

    if (displayText === "NaN") {
        $history.text("");
        $display.text("");
        calcArr = [];
        total = 0;
        hasDec = false;
        return;
    } else if (btn === "." && hasDec) {
        return;
    } else if (prevBtn === "equals") {
        //$display.text("");
        hasDec = false;
        calcArr = [];
        total = 0;
    }

    if (!isNaN(btn) || btn === ".") {
        if (btn === ".") {
            hasDec = true;
        }
        if (prevBtn === "operation") {
            $display.text("");
        }
        if (displayText.length < 16) {
            $display.append(btn);
            prevBtn = "number";
        }
    } else if (btn === "AC") {
        $display.text("");
        hasDec = false;
        calcArr = [];
        prevBtn = "all-clear";
    } else if (btn === "CE") {
        if (prevBtn === "equals") {
            $history.text("");
        }
        $display.text("");
        hasDec = false;
        prevBtn = "clear-entry";
        return;
    } else if (btn === "=") {
        var calcString = "";
        calcArr.push(displayText);
        if (prevBtn === "operation") {
            calcArr.splice(-2);
        }
        calcString = convertCalcArr(calcArr);
        total = eval(calcString);
        $display.text(total);
        prevBtn = "equals";
    } else {
        if (prevBtn === "operation" || prevBtn === "clear-entry") {
            if ($history.text() != "" && $display.text() === "") {
                calcArr.splice(-1);
            } else {
                calcArr.splice(-2);
            }
        }
        if (btn !== "-" && $display.text() === "") {
            return;
        }
        calcArr.push(displayText);
        calcArr.push(btn);
        prevBtn = "operation";
        hasDec = false;
    }

    displayHistory(calcArr);
    displayText = $display.text();

    if (displayText.length > 18) {
        $display.css({
            "font-size": "22px",
            "padding-top": "12px"
        });
    } else {
        $display.css({
            "font-size": "28px",
            "padding-top": "5px"
        });
    }
}

$(document).ready(function() {

    $("button").click(function() {

        // IE9 and older will not recognize pointer-events:none CSS rule on .blank.
        // This effectively disables the blank button no matter the browser.
        if ($(this).hasClass("blank")) {
            return;
        }

        var btn = $(this).text();
        buttonActions(btn);
    });


    // these are used to remove the hover styling from the buttons after clicking on them
    $("button").mouseup(function() {
        this.blur();
    });
    $("button").mousedown(function() {
        this.blur();
    });
});
