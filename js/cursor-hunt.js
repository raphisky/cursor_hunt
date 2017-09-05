
// Create cursor array
var cursors = [];

$.getJSON("https://spreadsheets.google.com/feeds/list/1EKoHbcOQAXVUbv9yOYlQ4qL8AWNTJOvc0r_D7pRd6Hs/od6/public/values?alt=json", function(data) {
  for (var el in data.feed.entry) {
    cursors.push(data.feed.entry[el].title.$t);
  }
  console.log(cursors);
  return cursors;
});

var availableCursors = [];
var winningCursor;

var level;
var newGameButton = document.getElementById("new-game");
var instructionsBox = document.getElementById("instructions");
var rescuedCursorsBox = document.getElementById("trophies");

newGameButton.onclick = function() {
    changeDialog("objective",spin(dialogStartGame));
    newGame(level);
    newGameButton.style.display = "none";
    instructionsBox.classList.add("boxed");
    rescuedCursorsBox.style.opacity = "1";
};


function setCursors(n) {
  availableCursors = [];
  for (var i =0; i < n ; i++) {
    var chosenCursor = cursors[Math.floor(Math.random()*cursors.length)];
    availableCursors.push(chosenCursor);
    cursors.splice(cursors[chosenCursor],1);
    console.log("new chosen cursor;" + chosenCursor);
  }
  console.log(availableCursors);
  return availableCursors;
};

function setWinningCursor() {
  winningCursor = availableCursors[Math.floor(Math.random()*availableCursors.length)];
  document.getElementById('winningCursorImage').src = winningCursor;
  console.log("winning cursor is "+ winningCursor);
  return winningCursor;
}

var canPlay = false; // prevents game from starting on first click.
var introOverlay = document.getElementById("intro");
var delayNewGame = 2000;
var mouseX, mouseY;


$("body").click(function( event ) {
  var clickedCursor = event.target.style.cursor;
  var formattedWinningCursor = "url("+"\""+winningCursor+"\""+"), default";
  var clickedDivId = event.target.id;
  console.log("clicked Cursor:" + clickedCursor + "|| Winning Cursor : " + formattedWinningCursor);
  introOverlay.style.display = "none";
  $("#instructions").removeClass("hidden");
  if (canPlay === false) {
    return canPlay = true;
  }
  else {
    // VICTORY
    if (String(clickedCursor).valueOf() === String(formattedWinningCursor).valueOf() && clickedDivId != "objective" ) {
      console.log("well done.");
      changeDialog("objective",spin(dialogIfVictory));
      // Add trophy to trophy div:
      var newTrophy = document.createElement("img");
      newTrophy.setAttribute("src",winningCursor);
      document.getElementById("trophies").appendChild(newTrophy);
      document.getElementById("winningCursorImage").style.display = "none";
      //Start new game
      setTimeout(function() {
        newGame(level)
      },delayNewGame);
    }

    else if (clickedDivId == "new-game") {
    }

    else if (clickedDivId == "instructions") {
      changeDialog("objective","I've already looked here. It must be somewhere on the page.");
    }

    else if (clickedDivId == "objective") {
      changeDialog("objective","This is only a picture... smh");
    }

    else if (clickedDivId == "alternate") {
      changeDialog("objective",spin(dialogIfAlternate));
      changeDialog("alternate", spin(wordingButtonAlternate));
    }

    else {
      changeDialog("objective",spin(dialogIfWrongCursor));
      console.log("Nope. cursor to find is still " + winningCursor);
    }
  };
});


function drawDivs(m) {
  for (var i = 0; i < m ; i++ ) {
    var divHeight =  120 + Math.floor(Math.random()*100) + 'px';
    var divWidth = Math.floor(Math.random()*30) + 10 + '%';
    var div = document.createElement('div');
    document.getElementById("grid").appendChild(div);
    div.setAttribute('class', 'grid-item');
    div.style.height =  "130px";
    div.style.width = divWidth;
    div.style.cursor = "URL("+availableCursors[i]+"), default";
    // div.style.background = randomColor();
  }
  console.log(m + " divs created");
};

// Still need to find the optimal layoutMode

function drawGrid() {
  $('.grid').masonry({
    // options
    percentPosition: true,
    itemSelector: '.grid-item',
    stamp: ".stamp"
  });
  console.log("grid has been successfully created.")
};


function newGame(level) {
  if (canPlay === true) {
    changeDialog("new-game", spin(wordingButtonNewGame));
    changeDialog("objective",spin(dialogStartGame));
    var level = Math.floor(Math.random()* 10) + 15;
    var o = document.getElementById("grid").childElementCount;
    var oldDivs = document.getElementById("grid");
    for (var i = 0; i < o; i++) {
        oldDivs.removeChild(oldDivs.childNodes[0]);
    }
    console.log("old divs have been removed");
    setCursors(level);
    setWinningCursor();
    drawDivs(level);
    drawGrid();
    document.getElementById("winningCursorImage").style.display = "inline-block";
  }
  else {};
};


// SPINTAX

var SPINTAX_PATTERN = /\{[^"\r\n\}]*\}/;
var spin = function (spun) {
  var match;
  while (match = spun.match(SPINTAX_PATTERN)) {
   match = match[0];
   var candidates = match.substring(1, match.length - 1).split("|");
   spun = spun.replace(match, candidates[Math.floor(Math.random() * candidates.length)])
  }
  return spun;
 }
var spin_countVariations = function (spun) {
  spun = spun.replace(/[^{|}]+/g, '1');
  spun = spun.replace(/\{/g, '(');
  spun = spun.replace(/\|/g, '+');
  spun = spun.replace(/\}/g, ')');
  spun = spun.replace(/\)\(/g, ')*(');
  spun = spun.replace(/\)1/g, ')*1');
  spun = spun.replace(/1\(/g, '1*(');
  return eval(spun);
 }

// INTRO AND MOBILE DETECTION





 // INTERACTIONS AND DIALOGS

var dialogStartGame = "Thanks for your help!\nIt's here somewhere on this page, use your mouse to find it.\nClick to capture it!";
var dialogRestartGame = "";
var dialogIfVictory = "{God bless you!|Theeeeere it was...|Oh! It was there all along?!?|Yay, thanks!}";
var dialogIfAlternate = "{We don't have time for this...}\n{If you must know, I am the Shepherd of cursors. I used to be {really|super} important in the world of computers...|Cursors are a really important part of computers. Someone has to care for them.|I have my reasons.}\n{Now{,|} will you help me?}";
var dialogIfWrongCursor = "Nope, I'm afraid that's {not the one...|the wrong one...}\n{Thanks, but maybe I should ask someone else...|}\n{Have you tried scrolling around?|Keep looking!}";
var dialogIfNotHere = "";
var dialogIfPicture = "";
var wordingButtonAlternate = "{Why?|Who are you?|Are those even your cursors?|What?|Do I know you from somewhere?|Where are we?}";
var wordingButtonNewGame = "{Sure!|Yeah why not|Ok|I'll take a look}"


// Generic function to change the content of a paragraph.
function changeDialog(id, string) {
  var newDialog = document.getElementById(id).innerText = string;
  return newDialog;
};
