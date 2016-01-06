// global variables
var calcArr = [];		// stores the calculation to be made, also used to update history display
var displayText = "";	// main display text in #display div
var hasDec = false;		// used to prevent more than one decimal place from being entered at a time
var prevBtn;			// stores the previous button that was clicked
var total = 0;			// total to display after equals button is clicked

// cache jQuery selectors
var $display = $("#display");	// main display
var $history = $("#history");	// calculation history display

/*
	Called from buttonActions() if btn === "="
	Converts calcArr into a string so that eval() can be performed on it
	Also swaps any "-" symbols for negative numbers back to the front of the number
	 if the symbols were changed in the displayHistory() function (i.e. change "246-" to "-246")
*/
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

/* 	
	Called from buttonActions() any time a button is pressed.
	Converts calcArr to a string and then displays the entered caculations in the #history div.
	Also note that the history div uses a "text-overflow: ellipsis" as well as a "text-align: right", and "direction: rtl". 
	  Because of this, the string must be reversed and then any negative number symbols ("-") must also be swapped
	  to the end of the negative number in order to display correctly. (i.e. change "-246 to 246-")
*/

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

    // change numbers like .23 to have a preceeding 0 (i.e. 0.23)
    if (displayText.charCodeAt(0) === 46) {
        displayText = "0" + displayText;
        $display.text(displayText);
    }

    // error checks that will clear everything and exit the function
    if (displayText === "NaN" || displayText === "Infinity") {
        $history.text("");
        $display.text("");
        calcArr = [];
        total = 0;
        hasDec = false;
        return;
    } else if (btn === "." && hasDec) {		// doesn't allow more than 1 decimal point per number entered
        return;
    } else if (prevBtn === "equals") {		// always clear the history and calculation array if previous button was "=" 
        hasDec = false;
        calcArr = [];
        total = 0;
    }

    // Any number button or decimal button
    if (!isNaN(btn) || btn === ".") {
        if (prevBtn === "equals") {
            $display.text("");
        }
        if (btn === ".") {
            hasDec = true;
        }
        if (prevBtn === "operation") {
            $display.text("");
        }
        if (btn === "0" && prevBtn === "number" && hasDec === false){
        	return;
        }
        if (prevBtn === "operation") {
            $display.append(btn);
            prevBtn = "number";
        } else if (displayText.length < 20) {
            $display.append(btn);
            prevBtn = "number";
        }
  	// All Clear button
    } else if (btn === "AC") {
        $display.text("");
        hasDec = false;
        calcArr = [];
        prevBtn = "all-clear";
 	// Clear Entry button
    } else if (btn === "CE") {
        if (prevBtn === "equals") {
            $history.text("");
        }
        $display.text("");
        hasDec = false;
        prevBtn = "clear-entry";
        return;
 	// Equals button
    } else if (btn === "=") {
        var calcString = "";
        calcArr.push(displayText);
        // if previous button was an operation we need to remove it from the array
        if (prevBtn === "operation") {
            calcArr.splice(-2);
        }
        calcString = convertCalcArr(calcArr);		// converts the calculation array into a string
        total = eval(calcString);					// perform eval() on that string to get the total of all operations
        $display.text(total);						// show the total on the display
        prevBtn = "equals";
  	// Any operation button (+ | - | *  | /)
    } else {
    	// allows selected operation to be changed without having to clear the display
        if (prevBtn === "operation" || prevBtn === "clear-entry") {
            if ($history.text() != "" && $display.text() === "") {
                calcArr.splice(-1);
            } else {
                calcArr.splice(-2);
            }
        }
        // only allow the - button to be used at the start of a new number / blank display
        if (btn !== "-" && $display.text() === "") {
            return;
        }
        calcArr.push(displayText);
        calcArr.push(btn);
        prevBtn = "operation";
        hasDec = false;
    }

    displayHistory(calcArr);			// update history display
    displayText = $display.text();		// update displaytext to store any change on main display

    // if the main display length is too long, change font/padding to make it fit
    if (displayText.length > 18) {
        $display.css({
            "font-size": "22px",
            "padding-top": "12px"
        });
 	// change it back to default if the display is short enough to fit
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
        // This will effectively disables the blank button no matter the browser.
        if ($(this).hasClass("blank")) {
            return;
        }

        // Perform specific actions based on the button that was pressed.
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
