var game = { steps: 0, two: 30, three: 50, opens: [] };
/*
 * Create a list that holds all of your cards
 */
var cards = [
  "fa-diamond", "fa-diamond",
  "fa-paper-plane-o", "fa-paper-plane-o",
  "fa-anchor", "fa-anchor",
  "fa-bolt", "fa-bolt",
  "fa-cube", "fa-cube",
  "fa-leaf", "fa-leaf",
  "fa-bicycle", "fa-bicycle",
  "fa-bomb", "fa-bomb"
];

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
function displayCards() {
  /*game.steps = 0;
$("span.moves").text(game.steps);
$("ul.stars li i").removeClass("fa-star-o").addClass("fa-star");*/

  cards = shuffle(cards);
  $("ul.deck").empty();
  cards.forEach(function(e) {
    var card = `<li class="card">
        <i class="fa ${e}"></i>
      </li>`;
    $("ul.deck").append(card);
  });
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
function openCard(card) {
  $(card).addClass("open show");
}

function checkMatch(symbol) {
  //if (game.opens[0] === game.opens[1]) {
  if (symbol === game.opens[1]) {
    //console.log("equal");
    //console.log(game.opens);
    lockCard(symbol);
  } else {
    //console.log("not equal");
    closeCard(game.opens.shift());
    closeCard(game.opens.shift());
    //console.log(game.opens);
  }
}

function lockCard(symbol) {
  $("i." + symbol).parent().addClass("match").removeClass("open show");
}

function closeCard(symbol) {
  window.setTimeout(function() {
    $("i." + symbol).parent().removeClass("open show");
  }, 500);
}

function countStep() {
  game.steps++;
  $("span.moves").text(game.steps);
  if (game.steps > game.two && game.steps <= game.three) {
    $("ul.stars li:nth-child(3)").find("i").removeClass("fa-star").addClass("fa-star-o");
  } else if (game.steps > game.three) {
    $("ul.stars li:nth-child(2)").find("i").removeClass("fa-star").addClass("fa-star-o");
  } else {
    $("ul.stars li i").removeClass("fa-star-o").addClass("fa-star");
  }
}

function checkWin() {
  //if (cards.length === game.opens.length) {
  if (game.opens.length > 2) {
    //TODO stopClock
    setTimeout(function() {
      openScore();

    }, 500);
    $(".message").text(`With ${game.steps} moves and 1 seconds`);
    if (game.two < game.steps && game.steps <= game.three) {
      $(".score > ul > li:nth-child(1)").find("i").toggleClass("hide");
      $(".score > ul > li:nth-child(2)").find("i").toggleClass("hide");
    } else if (game.three < game.steps) {
      $(".score > ul > li:nth-child(1)").find("i").toggleClass("hide");
      //$(".score > ul > li:nth-child(2)").find("i").toggleClass("hide");
    } else {
      $(".fa.fa-star.fa-5x").toggleClass("hide");
    }
  }
}

function openScore() {
  $("body").toggleClass("modal-open");
  $("body").append('<div class="modal-backdrop fade in"></div>');
  $(".modal").css({ "display": "block" });
}

function bindCard() {
  $("li.card").click(function() {

    //$(this).addClass("open show");
    openCard(this);
    var symbol = $(this).find("i").attr("class").slice(3);
    //console.log(symbol);
    game.opens.unshift(symbol);
    //console.log(game.opens);
    if (game.opens.length % 2 === 0 && game.opens.length > 0) {
      checkMatch(symbol);
    }

    countStep();

    checkWin();

  });
}

$(function() {
  displayCards();
  bindCard();

  $(".restart").click(function() {
    window.location.reload();
  });

  $(".play-again").click(function() {
    setTimeout(function() {
      window.location.reload();
    }, 500);
  });
  /*
  //TODOw
  $("ul.deck").click(function() {
    $("body").everyTime("1s", "palying", function() {

    });
  });*/
  //test
  //$("li.card").addClass("open").addClass("show");
});