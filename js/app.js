//存储游戏状态
let game = { steps: 0, two: 20, three: 40, opens: [], seconds: 0 };
/*
 * Create a list that holds all of your cards
 */
//游戏的全部卡片
let cards = [
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
/**
 * @description 洗牌
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
/**
 * @description 打开卡片
 * @param {object} card
 */
function openCard(card) {
  $(card).addClass("open show");
}
/**
 * @description 检查已打开的卡片是否匹配
 * @param {string} symbol卡片上的图标
 */
function checkMatch(symbol) {
  game.steps++;
  $("span.moves").text(game.steps);
  if (symbol === game.opens[1]) {
    lockCard(symbol);
  } else {
    closeCard(game.opens.shift());
    closeCard(game.opens.shift());
  }
}

/**
 * @description 锁定卡片
 * @param {string} symbol 卡片上的图标
 */
function lockCard(symbol) {
  $("i." + symbol).parent().addClass("match").removeClass("open show");
}
/**
 * @description 关闭卡片
 * @param {string} symbol 卡片上的图标
 */
function closeCard(symbol) {
  window.setTimeout(function() {
    $("i." + symbol).parent().removeClass("open show");
  }, 500);
}

/**
 * @description 记步
 */
function countStep() {
  if (game.steps > game.two && game.steps <= game.three) {
    $("ul.stars li:nth-child(3)").find("i").removeClass("fa-star").addClass("fa-star-o");
  } else if (game.steps > game.three) {
    $("ul.stars li:nth-child(2)").find("i").removeClass("fa-star").addClass("fa-star-o");
  } else {
    $("ul.stars li i").removeClass("fa-star-o").addClass("fa-star");
  }
}

/**
 * @description 检查是否完成游戏
 */
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
/**
 * @description 打开得分板
 */
function openScore() {
  $("body").toggleClass("modal-open");
  $("body").append('<div class="modal-backdrop fade in"></div>');
  $(".modal").css({ "display": "block" });
}
/**
 * @description 绑定翻开卡片的事件
 */
function bindCard() {
  $("li.card").click(function() {
    const isOpen = $(this).attr("class");
    if (!isOpen.includes("match") && !isOpen.includes("open")) {
      openCard(this);
      const symbol = $(this).find("i").attr("class").slice(3);
      game.opens.unshift(symbol);
      if (game.opens.length % 2 === 0 && game.opens.length > 0) {
        checkMatch(symbol);
      }
      countStep();
    }
    checkWin();
  });
}

$(function() {
  //洗牌
  displayCards();
  //绑定翻开卡片事件
  bindCard();

  //绑定重新开始事件
  $(".restart").click(function() {
    window.location.reload();
  });

  //绑定再玩一局事件
  $(".play-again").click(function() {
    setTimeout(function() {
      window.location.reload();
    }, 500);
  });

  //绑定计时器开始事件
  $("ul.deck").one("click", function() {
    $("body").everyTime("1s", "playing", function() {
      game.seconds++;
      $(".seconds").text(game.seconds);
    });
  });

});

// jquery timer 插件代码   https://www.jianshu.com/p/6a8ce88c7f02
jQuery.fn.extend({
  everyTime: function(interval, label, fn, times, belay) {
    return this.each(function() {
      jQuery.timer.add(this, interval, label, fn, times, belay);
    });
  },
  oneTime: function(interval, label, fn) {
    return this.each(function() {
      jQuery.timer.add(this, interval, label, fn, 1);
    });
  },
  stopTime: function(label, fn) {
    return this.each(function() {
      jQuery.timer.remove(this, label, fn);
    });
  }
});

jQuery.event.special

jQuery.extend({
  timer: {
    global: [],
    guid: 1,
    dataKey: "jQuery.timer",
    regex: /^([0-9]+(?:\.[0-9]*)?)\s*(.*s)?$/,
    powers: {
      // Yeah this is major overkill...
      'ms': 1,
      'cs': 10,
      'ds': 100,
      's': 1000,
      'das': 10000,
      'hs': 100000,
      'ks': 1000000
    },
    timeParse: function(value) {
      if (value == undefined || value == null)
        return null;
      var result = this.regex.exec(jQuery.trim(value.toString()));
      if (result[2]) {
        var num = parseFloat(result[1]);
        var mult = this.powers[result[2]] || 1;
        return num * mult;
      } else {
        return value;
      }
    },
    add: function(element, interval, label, fn, times, belay) {
      var counter = 0;

      if (jQuery.isFunction(label)) {
        if (!times)
          times = fn;
        fn = label;
        label = interval;
      }

      interval = jQuery.timer.timeParse(interval);

      if (typeof interval != 'number' || isNaN(interval) || interval <= 0)
        return;

      if (times && times.constructor != Number) {
        belay = !!times;
        times = 0;
      }

      times = times || 0;
      belay = belay || false;

      var timers = jQuery.data(element, this.dataKey) || jQuery.data(element, this.dataKey, {});

      if (!timers[label])
        timers[label] = {};

      fn.timerID = fn.timerID || this.guid++;

      var handler = function() {
        if (belay && this.inProgress)
          return;
        this.inProgress = true;
        if ((++counter > times && times !== 0) || fn.call(element, counter) === false)
          jQuery.timer.remove(element, label, fn);
        this.inProgress = false;
      };

      handler.timerID = fn.timerID;

      if (!timers[label][fn.timerID])
        timers[label][fn.timerID] = window.setInterval(handler, interval);

      this.global.push(element);

    },
    remove: function(element, label, fn) {
      var timers = jQuery.data(element, this.dataKey),
        ret;

      if (timers) {

        if (!label) {
          for (label in timers)
            this.remove(element, label, fn);
        } else if (timers[label]) {
          if (fn) {
            if (fn.timerID) {
              window.clearInterval(timers[label][fn.timerID]);
              delete timers[label][fn.timerID];
            }
          } else {
            for (var fn in timers[label]) {
              window.clearInterval(timers[label][fn]);
              delete timers[label][fn];
            }
          }

          for (ret in timers[label]) break;
          if (!ret) {
            ret = null;
            delete timers[label];
          }
        }

        for (ret in timers) break;
        if (!ret)
          jQuery.removeData(element, this.dataKey);
      }
    }
  }
});

jQuery(window).bind("unload", function() {
  jQuery.each(jQuery.timer.global, function(index, item) {
    jQuery.timer.remove(item);
  });
});