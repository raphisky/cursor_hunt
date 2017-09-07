
// Create cursor array
var cursors = [];

$.getJSON("https://spreadsheets.google.com/feeds/list/1EKoHbcOQAXVUbv9yOYlQ4qL8AWNTJOvc0r_D7pRd6Hs/od6/public/values?alt=json", function(data) {
  for (var el in data.feed.entry) {
    cursors.push(data.feed.entry[el].title.$t);
  }
  console.log(cursors);
  return cursors;
});


var check;
var onMobile;
$(function()  {
  window.mobileAndTabletcheck = function() {
    var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    console.log(check);
    return check;
  };
  window.mobileAndTabletcheck();
  if (check) {
    document.getElementById("introSubtitle").innerText = "Looks like you don't have a mouse. That's a shame. This game has no use for mouseless people. Send the link to yourself, and come back when you have a mouse. Have a good one.";
  }
  else {
  }
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
      // add impact to spawnInterval
    }

    else if (event.target.className == "emoji") {
      console.log("touché");
      killEmoji(event);
      spawnEmoji();
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
    var divHeight =  130 + 'px';
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
    if (rescuedCursors == 3){
      changeDialog("objective","I should warn you. Emojis are lurking around here, and they don't mean well. See one? Kill one.");
      var level = Math.floor(Math.random()* 10) + 15;
      clearDivs(".grid-item");
      setCursors(level);
      setWinningCursor();
      drawDivs(level);
      drawGrid();
      document.getElementById("winningCursorImage").style.display = "inline-block";
      setTimeout(spawnEmoji(),4000);
    }
    else {
      changeDialog("objective",spin(dialogStartGame));
      var level = Math.floor(Math.random()* 10) + 5;
      clearDivs(".grid-item");
      setCursors(level);
      setWinningCursor();
      drawDivs(level);
      drawGrid();
      document.getElementById("winningCursorImage").style.display = "inline-block";
    }
  }
  else {};
};

var classToRemove;
function clearDivs(classToRemove) {
  $(".grid-item").remove();
  console.log("grid should be clean.")
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

var dialogStartGame = "Thanks for your help!\nNow let's find {another|this} one...\nClick to capture it!";
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
// add are we safe question.


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


// it can only start when you've rescued 2 cursors.
 var canAttack = false;

 dialogEmojiWarning = "There are some emojis lurking out there.\nThey will harm the cursors!\nSquash them if you see any.";


// then I need to make an array containing a lot of emojis.
var emojis = "{😀|😃|😄|😁|😆|😅|😂|🤣|☺️|😊|😇|🙂|🙃|😉|😌|😍|😘|😗|😙|😚|😋|😜|😝|😛|🤑|🤗|🤓|😎|🤡|🤠|😏|😒|😞|😔|😟|😕|🙁|☹️|😣|😖|😫|😩|😤|😠|😡|😶|😐|😑|😯|😦|😧|😮|😲|😵|😳|😱|😨|😰|😢|😥|🤤|😭|😓|😪|😴|🙄|🤔|🤥|😬|🤐|🤢|🤧|😷|🤒|🤕|😈|👿|👹|👺|💩|👻|💀|☠️|👽|👾|🤖|🎃|😺|😸|😹|😻|😼|😽|🙀|😿|😾|👐|🙌|👏|🙏|🤝|👍|👎|👊|✊|🤛|🤜|🤞|✌️|🤘|👌|👈|👉|👆|👇|☝️|✋|🤚|🖐|🖖|👋|🤙|💪|🖕|✍️|🤳|💅|🖖|💄|💋|👄|👅|👂|👃|👣|👁|👀|🗣|👤|👥|👶|👦|👧|👨|👩|👱‍♀️|👱|👴|👵|👲|👳‍♀️|👳|👮‍♀️|👮|👷‍♀️|👷|💂‍♀️|💂|🕵️‍♀️|🕵️|👩‍⚕️|👨‍⚕️|👩‍🌾|👨‍🌾|👩‍🍳|👨‍🍳|👩‍🎓|👨‍🎓|👩‍🎤|👨‍🎤|👩‍🏫|👨‍🏫|👩‍🏭|👨‍🏭|👩‍💻|👨‍💻|👩‍💼|👨‍💼|👩‍🔧|👨‍🔧|👩‍🔬|👨‍🔬|👩‍🎨|👨‍🎨|👩‍🚒|👨‍🚒|👩‍✈️|👨‍✈️|👩‍🚀|👨‍🚀|👩‍⚖️|👨‍⚖️|🤶|🎅|👸|🤴|👰|🤵|👼|🤰|🙇‍♀️|🙇|💁|💁‍♂️|🙅|🙅‍♂️|🙆|🙆‍♂️|🙋|🙋‍♂️|🤦‍♀️|🤦‍♂️|🤷‍♀️|🤷‍♂️|🙎|🙎‍♂️|🙍|🙍‍♂️|💇|💇‍♂️|💆|💆‍♂️|🕴|💃|🕺|👯|👯‍♂️|🚶‍♀️|🚶|🏃‍♀️|🏃|👫|👭|👬|💑|👩‍❤️‍👩|👨‍❤️‍👨|💏|👩‍❤️‍💋‍👩|👨‍❤️‍💋‍👨|👪|👨‍👩‍👧|👨‍👩‍👧‍👦|👨‍👩‍👦‍👦|👨‍👩‍👧‍👧|👩‍👩‍👦|👩‍👩‍👧|👩‍👩‍👧‍👦|👩‍👩‍👦‍👦|👩‍👩‍👧‍👧|👨‍👨‍👦|👨‍👨‍👧|👨‍👨‍👧‍👦|👨‍👨‍👦‍👦|👨‍👨‍👧‍👧|👩‍👦|👩‍👧|👩‍👧‍👦|👩‍👦‍👦|👩‍👧‍👧|👨‍👦|👨‍👧|👨‍👧‍👦|👨‍👦‍👦|👨‍👧‍👧|👚|👕|👖|👔|👗|👙|👘|👠|👡|👢|👞|👟|👒|🎩|🎓|👑|⛑|🎒|👝|👛|👜|💼|👓|🕶|🌂|☂️|🐶|🐱|🐭|🐹|🐰|🦊|🐻|🐼|🐨|🐯|🦁|🐮|🐷|🐽|🐸|🐵|🙊|🙉|🙊|🐒|🐔|🐧|🐦|🐤|🐣|🐥|🦆|🦅|🦉|🦇|🐺|🐗|🐴|🦄|🐝|🐛|🦋|🐌|🐚|🐞|🐜|🕷|🕸|🐢|🐍|🦎|🦂|🦀|🦑|🐙|🦐|🐠|🐟|🐡|🐬|🦈|🐳|🐋|🐊|🐆|🐅|🐃|🐂|🐄|🦌|🐪|🐫|🐘|🦏|🦍|🐎|🐖|🐐|🐏|🐑|🐕|🐩|🐈|🐓|🦃|🕊|🐇|🐁|🐀|🐿|🐾|🐉|🐲|🌵|🎄|🌲|🌳|🌴|🌱|🌿|☘️|🍀|🎍|🎋|🍃|🍂|🍁|🍄|🌾|💐|🌷|🌹|🥀|🌻|🌼|🌸|🌺|🌎|🌍|🌏|🌕|🌖|🌗|🌘|🌑|🌒|🌓|🌔|🌚|🌝|🌞|🌛|🌜|🌙|💫|⭐️|🌟|✨|⚡️|🔥|💥|☄️|☀️|🌤|⛅️|🌥|🌦|🌈|☁️|🌧|⛈|🌩|🌨|☃️|⛄️|❄️|🌬|💨|🌪|🌫|🌊|💧|💦|☔️|🍏|🍎|🍐|🍊|🍋|🍌|🍉|🍇|🍓|🍈|🍒|🍑|🍍|🥝|🥑|🍅|🍆|🥒|🥕|🌽|🌶|🥔|🍠|🌰|🥜|🍯|🥐|🍞|🥖|🧀|🥚|🍳|🥓|🥞|🍤|🍗|🍖|🍕|🌭|🍔|🍟|🥙|🌮|🌯|🥗|🥘|🍝|🍜|🍲|🍥|🍣|🍱|🍛|🍚|🍙|🍘|🍢|🍡|🍧|🍨|🍦|🍰|🎂|🍮|🍭|🍬|🍫|🍿|🍩|🍪|🥛|🍼|☕️|🍵|🍶|🍺|🍻|🥂|🍷|🥃|🍸|🍹|🍾|🥄|🍴|🍽|⚽️|🏀|🏈|⚾️|🎾|🏐|🏉|🎱|🏓|🏸|🥅|🏒|🏑|🏏|⛳️|🏹|🎣|🥊|🥋|⛸|🎿|⛷|🏂|🏋️‍♀️|🏋️|🤺|🤼‍♀️|🤼‍♂️|🤸‍♀️|🤸‍♂️|⛹️‍♀️|⛹️|🤾‍♀️|🤾‍♂️|🏌️‍♀️|🏌️|🏄‍♀️|🏄|🏊‍♀️|🏊|🤽‍♀️|🤽‍♂️|🚣‍♀️|🚣|🏇|🚴‍♀️|🚴|🚵‍♀️|🚵|🎽|🏅|🎖|🥇|🥈|🥉|🏆|🏵|🎗|🎫|🎟|🎪|🤹‍♀️|🤹‍♂️|🎭|🎨|🎬|🎤|🎧|🎼|🎹|🥁|🎷|🎺|🎸|🎻|🎲|🎯|🎳|🎮|🎰|🚗|🚕|🚙|🚌|🚎|🏎|🚓|🚑|🚒|🚐|🚚|🚛|🚜|🛴|🚲|🛵|🏍|🚨|🚔|🚍|🚘|🚖|🚡|🚠|🚟|🚃|🚋|🚞|🚝|🚄|🚅|🚈|🚂|🚆|🚇|🚊|🚉|🚁|🛩|✈️|🛫|🛬|🚀|🛰|💺|🛶|⛵️|🛥|🚤|🛳|⛴|🚢|⚓️|🚧|⛽️|🚏|🚦|🚥|🗺|🗿|🗽|⛲️|🗼|🏰|🏯|🏟|🎡|🎢|🎠|⛱|🏖|🏝|⛰|🏔|🗻|🌋|🏜|🏕|⛺️|🛤|🛣|🏗|🏭|🏠|🏡|🏘|🏚|🏢|🏬|🏣|🏤|🏥|🏦|🏨|🏪|🏫|🏩|💒|🏛|⛪️|🕌|🕍|🕋|⛩|🗾|🎑|🏞|🌅|🌄|🌠|🎇|🎆|🌇|🌆|🏙|🌃|🌌|🌉|🌁|⌚️|📱|📲|💻|⌨️|🖥|🖨|🖱|🖲|🕹|🗜|💽|💾|💿|📀|📼|📷|📸|📹|🎥|📽|🎞|📞|☎️|📟|📠|📺|📻|🎙|🎚|🎛|⏱|⏲|⏰|🕰|⌛️|⏳|📡|🔋|🔌|💡|🔦|🕯|🗑|🛢|💸|💵|💴|💶|💷|💰|💳|💎|⚖️|🔧|🔨|⚒|🛠|⛏|🔩|⚙️|⛓|🔫|💣|🔪|🗡|⚔️|🛡|🚬|⚰️|⚱️|🏺|🔮|📿|💈|⚗️|🔭|🔬|🕳|💊|💉|🌡|🚽|🚰|🚿|🛁|🛀|🛎|🔑|🗝|🚪|🛋|🛏|🛌|🖼|🛍|🛒|🎁|🎈|🎏|🎀|🎊|🎉|🎎|🏮|🎐|✉️|📩|📨|📧|💌|📥|📤|📦|🏷|📪|📫|📬|📭|📮|📯|📜|📃|📄|📑|📊|📈|📉|🗒|🗓|📆|📅|📇|🗃|🗳|🗄|📋|📁|📂|🗂|🗞|📰|📓|📔|📒|📕|📗|📘|📙|📚|📖|🔖|🔗|📎|🖇|📐|📏|📌|📍|📌|🎌|🏳️|🏴|🏁|🏳️‍🌈|✂️|🖊|🖋|✒️|🖌|🖍|📝|✏️|🔍|🔎|🔏|🔐|🔒|🔓|🤣|🤠|🤡|🤥|🤤|🤢|🤧|🤴|🤶|🤵|🤷|🤦|🤰|🕺|🤳|🤞|🤙|🤛|🤜|🤚|🤝|🖤|🦍|🦊|🦌|🦏|🦇|🦅|🦆|🦉|🦎|🦈|🦐|🦑|🦋|🥀|🥝|🥑|🥔|🥕|🥒|🥜|🥐|🥖|🥞|🥓|🥙|🥚|🥘|🥗|🥛|🥂|🥃|🥄|🛑|🛴|🛵|🛶|🥇|🥈|🥉|🥊|🥋|🤸|🤼|🤽|🤾|🤺|🥅|🤹|🥁|🛒}";



function spawnEmoji() {
    var gridHeight = $(window).height();
    var gridWidth = $(window).width();
    var emojiPosX = (Math.floor(Math.random()*800)+200) +"px";// random but not too random
    var emojiPosY = (Math.floor(Math.random()*500)+200) +"px"; // random but not too random
    var emojiToSpawn = spin(emojis);
    console.log(emojiToSpawn);
    var newEmoji = document.createElement("div");
    document.getElementById("grid").appendChild(newEmoji);
    newEmoji.style.position = "absolute";
    newEmoji.style.left = emojiPosX;
    newEmoji.style.bottom = emojiPosY;
    newEmoji.style.fontSize = 24 + Math.floor(Math.random)*24 + "px";
    newEmoji.style.height = 30+"px";
    newEmoji.style.width = 30+"px";
    newEmoji.innerText = emojiToSpawn;
    newEmoji.classList.add("emoji");
    newEmoji.style.cursor = "url(./img/chainsaw.gif), default";
    // nice to have: randomly-sized emoji
}

var spawnInterval = 10000;
// setInterval(spawnEmoji(),spawnInterval);


var emojiBlood = "{url(./img/blood_2.png)|url(./img/blood_6.png)|url(./img/blood_7.png)|url(./img/blood_9.png)|url(./img/blood_10.png)|url(./img/blood_11.png)|url(./img/blood_12.png)|url(./img/blood_14.png)}";
function killEmoji(event) {
  event.target.innerText = "";
  event.target.style.background = spin(emojiBlood) +" no-repeat center";
  event.target.setAttribute('class','killedEmoji');
}

// then, I need to make it move towards the rescue box.
// then, if it is the first div, I must update Dialog and give instructions to the player.
// it disappears if it is clicked.
// it needs to run in the background
