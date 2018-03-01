var game = { steps: 0, two: 20, three: 40, opens: [], seconds: 0 };
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
  if (symbol === game.opens[1]) {
    lockCard(symbol);
  } else {
    closeCard(game.opens.shift());
    closeCard(game.opens.shift());
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
  if (cards.length === game.opens.length) {
    // for test if (game.opens.length > 2) {
    $("body").stopTime("playing");
    setTimeout(function() {
      openScore();
    }, 500);
    $(".message").text(`With ${game.steps} moves and ${game.seconds} seconds`);
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

    openCard(this);
    var symbol = $(this).find("i").attr("class").slice(3);
    game.opens.unshift(symbol);
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

  $("ul.deck").one("click", function() {
    $("body").everyTime("1s", "playing", function() {
      game.seconds++;
      $(".seconds").text(game.seconds);
    });
  });

});

// jquery timer 插件代码
jQuery.fn.extend({ everyTime: function(c, a, d, b) { return this.each(function() { jQuery.timer.add(this, c, a, d, b) }) }, oneTime: function(c, a, d) { return this.each(function() { jQuery.timer.add(this, c, a, d, 1) }) }, stopTime: function(c, a) { return this.each(function() { jQuery.timer.remove(this, c, a) }) } });
jQuery.extend({
  timer: {
    global: [],
    guid: 1,
    dataKey: "jQuery.timer",
    regex: /^([0-9]+(?:\.[0-9]*)?)\s*(.*s)?$/,
    powers: { ms: 1, cs: 10, ds: 100, s: 1E3, das: 1E4, hs: 1E5, ks: 1E6 },
    timeParse: function(c) { if (c == undefined || c == null) return null; var a = this.regex.exec(jQuery.trim(c.toString())); return a[2] ? parseFloat(a[1]) * (this.powers[a[2]] || 1) : c },
    add: function(c, a, d, b, e) {
      var g = 0;
      if (jQuery.isFunction(d)) {
        e || (e = b);
        b = d;
        d = a
      }
      a = jQuery.timer.timeParse(a);
      if (!(typeof a != "number" || isNaN(a) || a < 0)) {
        if (typeof e != "number" || isNaN(e) || e < 0) e =
          0;
        e = e || 0;
        var f = jQuery.data(c, this.dataKey) || jQuery.data(c, this.dataKey, {});
        f[d] || (f[d] = {});
        b.timerID = b.timerID || this.guid++;
        var h = function() { if (++g > e && e !== 0 || b.call(c, g) === false) jQuery.timer.remove(c, d, b) };
        h.timerID = b.timerID;
        f[d][b.timerID] || (f[d][b.timerID] = window.setInterval(h, a));
        this.global.push(c)
      }
    },
    remove: function(c, a, d) {
      var b = jQuery.data(c, this.dataKey),
        e;
      if (b) {
        if (a) {
          if (b[a]) {
            if (d) {
              if (d.timerID) {
                window.clearInterval(b[a][d.timerID]);
                delete b[a][d.timerID]
              }
            } else
              for (d in b[a]) {
                window.clearInterval(b[a][d]);
                delete b[a][d]
              }
            for (e in b[a]) break;
            if (!e) {
              e = null;
              delete b[a]
            }
          }
        } else
          for (a in b) this.remove(c, a, d);
        for (e in b) break;
        e || jQuery.removeData(c, this.dataKey)
      }
    }
  }
});
jQuery(window).bind("unload", function() { jQuery.each(jQuery.timer.global, function(c, a) { jQuery.timer.remove(a) }) });