
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

// check if user has won
$("body").click(function( event ) {
  var clickedCursor = event.target.style.cursor;
  var formattedWinningCursor = "url("+"\""+winningCursor+"\""+"), default";
  var clickedDivId = event.target.id; // prevents from winning when clicking on the result box;
  console.log("clicked Cursor:" + clickedCursor + "|| Winning Cursor : " + formattedWinningCursor);
  if (String(clickedCursor).valueOf() === String(formattedWinningCursor).valueOf() && clickedDivId != "objective" ) {
    console.log("well done.");
    changeDialog("objective",spin(dialogIfVictory));
    var newTrophy = document.createElement("img");
    newTrophy.setAttribute("src",winningCursor);
    document.getElementById("trophies").appendChild(newTrophy);
    document.getElementById("winningCursorImg").style.display = none;
    changeDialog("new-game", spin(wordingButtonNewGame));
    // FIXME : there's a bug that allows to add a trophy as many times as you click on it.
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
});


function drawDivs(m) {
  for (var i = 0; i < m ; i++ ) {
    var divHeight =  150 + Math.floor(Math.random()*100) + 'px';
    var divWidth = Math.floor(Math.random()*50) + '%';
    var div = document.createElement('div');
    document.getElementById("grid").appendChild(div);
    div.setAttribute('class', 'grid-item');
    div.style.height =  divHeight;
    div.style.width = divWidth;
    div.style.cursor = "URL("+availableCursors[i]+"), default";
    // div.style.background = randomColor();
  }
  console.log(m + " divs created");
};

// Still need to find the optimal layoutMode

function drawGrid() {
  $('.grid').isotope({
    // options
    percentPosition: true,
    itemSelector: '.grid-item',
    layoutMode: 'packery',
    packery: {
      columnWidth: '.grid-sizer'
    },
    stamp: ".stamp"
  });
  console.log("grid has been successfully created.")
};

var level;
document.getElementById("new-game").onclick = function() {newGame(level)};

function newGame(level) {
    changeDialog("objective",spin(dialogStartGame));
    var level = Math.floor(Math.random()* 20) + 7;
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

 // INTERACTIONS AND DIALOGS

var dialogStartGame = "{You rock|Thanks|You're a star|Wow, thanks}{!|.|...}\nIt's here somewhere on this page, use your mouse to find it. Click to capture it!";
var dialogIfVictory = "{God bless you!|Theeeeere it was...|Oh! It was there all along?!?}\n{Now, I know that's a lot to ask, but I've actually lost another one... Can you help me?}";
var dialogIfAlternate = "{If you must know, I am the Shepherd of cursors. I used to be {really|super} important in the world of computers...|Cursors are a really important part of computers. Someone has to care for them.|I have my reasons.}\n{Now{,|} will you help me?}";
var dialogIfWrongCursor = "{Nope, {I'm afraid |} that's not the one...|Wrong one...|Thanks, but maybe I should ask someone else...}\n{Have you tried scrolling around?|Keep looking!}";
var dialogIfNotHere = "";
var dialogIfPicture = "";
var wordingButtonAlternate = "{Why?|Nah.|Who are you?|Are those even your cursors?|What?|Do I know you from somewhere?}";
var wordingButtonNewGame = "{Sure!|Yeah why not|Ok|I'll take a look}"


// Generic function to change the content of a paragraph.
function changeDialog(id, string) {
  var newDialog = document.getElementById(id).innerText = string;
  return newDialog;
};
