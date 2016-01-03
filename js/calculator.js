// global variables
var inputArr = [];
var total = 0;
var prevBtn;
var displayText = "";
var hasPoint = false;

// cache jQuery selectors
var $display = $("#display");
var $history = $("#history");

function reverseString(s) {
    return s.split(/\s/).reverse().join(' ');
}

function displayHistory(arr) {
    var temp = "";

    for (var x = 0; x < arr.length; x++) {
        temp += arr[x] + " ";
    }
    temp = reverseString(temp);
    $history.text(temp);
}

function buttonListener(btn) {
    displayText = $display.text();

    if (displayText === "NaN") {
        $history.text("");
        $display.text("");
        inputArr = [];
        total = 0;
        hasPoint = false;
        return;
    } else if (btn === "." && hasPoint) {
        return;
    } else if (prevBtn === "equals") {
        $display.text("");
        hasPoint = false;
        inputArr = [];
        total = 0;
    }

    if (!isNaN(btn) || btn === ".") {
        if (btn === ".") {
            hasPoint = true;
        }

        if (displayText.length < 16) {
            if (prevBtn === "operation") {
                $display.text("");
                hasPoint = false;
            }
            $display.append(btn);
            prevBtn = "number";
        }
    } else if (btn === "AC") {
        $display.text("");
        hasPoint = false;
        inputArr = [];
        prevBtn = "all-clear";
    } else if (btn === "CE") {
        if (prevBtn === "equals") {
            $history.text("");
        }
        $display.text("");
        hasPoint = false;
        prevBtn = "clear-entry";
        return;
    } else if (btn === "=") {
        inputArr.push(displayText);
        var total = Number(inputArr[0]);
        for (var x = 1; x < inputArr.length; x++) {
            var opType = inputArr[x];
            var secondNum = Number(inputArr[x + 1]);

            if (opType === "+") {
                total += secondNum;
            } else if (opType === "-") {
                total -= secondNum;
            } else if (opType === "*") {
                total *= secondNum;
            } else if (opType === "/") {
                total /= secondNum;
            }

            x++;
        }

        $display.text(total);
        prevBtn = "equals";
    } else {
        if (prevBtn === "operation" || prevBtn === "clear-entry") {
            if ($history.text() != "" && $display.text() === "") {
                inputArr.splice(-1);
            } else {
                inputArr.splice(-2);
            }
        }

        inputArr.push(displayText);
        inputArr.push(btn);
        prevBtn = "operation";
    }

    displayHistory(inputArr);

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

        // cache the button and pass it into buttonActions()
        var btn = $(this).text();
        buttonListener(btn);
    });


    // these are used to remove the hover styling from the buttons after clicking on them
    $("button").mouseup(function() {
        this.blur();
    });
    $("button").mousedown(function() {
        this.blur();
    });
});
