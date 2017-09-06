
// Create cursor array
var cursors = [];

$.getJSON("https://spreadsheets.google.com/feeds/list/1EKoHbcOQAXVUbv9yOYlQ4qL8AWNTJOvc0r_D7pRd6Hs/od6/public/values?alt=json", function(data) {
  for (var el in data.feed.entry) {
    cursors.push(data.feed.entry[el].title.$t);
  }
  console.log(cursors);
  return cursors;
});

// GAME VARIABLES
var availableCursors = []; // Cursors currently on the page (refreshed every game)
var winningCursor; // Cursor to find
var level; // currently random.
var rescuedCursors = 0; // incremented whenever a cursor is rescued.
var canPlay = false; // prevents game from starting on first click.
var delayNewGame = 2000; // delay between winning a game and starting a new one. Shitty af.


// PAGE ELEMENTS
var newGameButton = document.getElementById("new-game");
var instructionsBox = document.getElementById("instructions");
var rescuedCursorsBox = document.getElementById("trophies");
var gridBox = document.getElementById("grid");


// START GAME
newGameButton.onclick = function() {
    changeDialog("objective",spin(dialogStartGame));
    newGame(level);
    newGameButton.style.display = "none";
    instructionsBox.classList.add("boxed");
    rescuedCursorsBox.style.opacity = "1";
};

// Loads availableCursors
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

// Chooses the winning Cursor among availableCursors;
function setWinningCursor() {
  winningCursor = availableCursors[Math.floor(Math.random()*availableCursors.length)];
  document.getElementById('winningCursorImage').src = winningCursor;
  console.log("winning cursor is "+ winningCursor);
  return winningCursor;
}

function addRescuedCursor(cursor) {
  var newTrophy = document.createElement("img");
  newTrophy.setAttribute("src",cursor);
  document.getElementById("trophies").appendChild(newTrophy);
  document.getElementById("winningCursorImage").style.display = "none";
  rescuedCursors += 1;
  console.log("rescuedCursors : "+rescuedCursors);
  return rescuedCursors;
};

var introOverlay = document.getElementById("intro");


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
      addRescuedCursor(winningCursor);
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
      changeDialog("objective",chooseAnswerToAlternateQuestions(event));
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
    div.style.background = randomColor();
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
    clearDivs("grid-sizer");
    console.log("old divs have been removed");
    setCursors(level);
    setWinningCursor();
    drawDivs(level);
    drawGrid();
    document.getElementById("winningCursorImage").style.display = "inline-block";
  }
  else {};
};

var classToRemove;
function clearDivs(classToRemove) {
  $("grid").remove(classToRemove);
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
var dialogIfAlternate =  "{We don't have time for this.|Curiosity killed the cat, you know that right?|You sure have a lot of questions, unique visitor!}\n{I go by the name of the|They call me the} {Lord|Protector} of Cursors. I used to be very important in the world of computers! Now look at me, {asking|begging} for a stranger's help... {Cursors are an endangered species, nowadays. People use their fingers now, can you believe that? Truly disgusting.|Cursors used to be loved and cherished. But people forget.|To tell you the truth, I fear for the very existence of cursors.}\n{Now, if we could go back to our business.|Now, can you help me find this one?|That's why there's no time to waste. Help me rescue them!}";
var dialogIfWrongCursor = "Nope, I'm afraid that's {not the one...|the wrong one...}\n{Thanks, but maybe I should ask someone else...|}\n{Have you tried scrolling around?|Keep looking!}";
var dialogIfNotHere = "";
var dialogIfPicture = "";
var wordingButtonAlternate = "{Why?|Who are you?|Are those even your cursors?|What?|Do I know you from somewhere?|Where are we?}";
var wordingButtonNewGame = "{Sure!|Yeah why not|Ok|I'll take a look}";

var answerIfWhy = "{Because.|Because!}";
var answerIfWhoareyou = "{No one.|it does not matter.}";
var answerIfAreThoseYourCursors = "{You ask|You're asking} {a lot of questions.|too much.}";
var answerIfWhereAreWe = "{No one will hear you scream here, that's for sure|On the internet.}";
var answerIfDoIKnowYou = "{Never met before.|No chance, no}";
var answerIfElse = "{GAAAAAAH|GUEEEEEUUUHHH}";
var answerIfWhat = "{We need to find the cursors!Quick!}"

// Checks what the question in the alternate button is, and returns answer accordingly.
// This if statement extravaganza could probably be solved if i turned wordingButtonAlternate into an array, then looked for clickedQuestion in this array, and then i'd be fucked either way well that's nice I'm really good at programming apparently.
var chosenAnswser;
function chooseAnswerToAlternateQuestions(event) {
  var clickedQuestion = event.target.text;
  if (clickedQuestion == "Who are you?") {
    chosenAnswser = answerIfWhoareyou;
  }
  else if (clickedQuestion == "Why?") {
    chosenAnswser = answerIfWhy;
  }
  else if (clickedQuestion == "Are those even your cursors?") {
    chosenAnswser = answerIfAreThoseYourCursors;

  }
  else if (clickedQuestion == "Where are we?") {
    chosenAnswser = answerIfWhereAreWe;

  }
  else if (clickedQuestion == "Do I know you from somewhere?") {
    chosenAnswser = answerIfDoIKnowYou;
  }
  else if (clickedQuestion == "What?") {
    chosenAnswser = answerIfWhat;
  }
  else {
    chosenAnswser = answerIfElse;
  }
  return spin(chosenAnswser); // this allows us to directly insert this function in the changeDialog function. hopefully.
}

// Generic function to change the content of a paragraph.
function changeDialog(id, string) {
  var newDialog = document.getElementById(id).innerText = string;
  return newDialog;
};

// EMOJI ATTACK

// i need some progression. so level has to be updated when the player finds a cursor.



var emojis = [];


// then I need to make an array containing a lot of emojis.
// then I need to create a div and put a random emoji in it.
// then I need to position the div somehwhere on the page.
// then, I need to make it move towards the rescue box.
// then, if it is the first div, I must update Dialog and give instructions to the player.
// it disappears if it is clicked.
// it needs to run in the background
