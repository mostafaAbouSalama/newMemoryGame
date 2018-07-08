/*
 * Create a list that holds all of your cards
 */

let deckOfCardsArray = Array.from(document.getElementsByClassName("card"));
let arrayOfOpenCards = [];
let arrayOfMatchedCards = [];
let eachFlip = 0;
let counter = 0;
let movesCounter = Array.from(document.getElementsByClassName("moves"));
let minSpan = document.getElementById("minutes");
let secSpan = document.getElementById("seconds");
let totalSeconds = 0;
let startTimer;
let theTime = Array.from(document.getElementsByClassName("tim"));
let modal = document.getElementById("theModal");
let starRating = Array.from(document.getElementsByClassName("fa-star"));

function flipThisCardUp(event) {
  if (event.target.className === "card match") {
    return "matched";
  } else if (event.target.className === "card open show") {
    return "up";
  } else {
    event.target.className = "card open show";
    eachFlip++;
    return "flipped";
  }
}

function addMeToOpenCards(event, condition) {
  if (arguments[1] === "flipped") {
    arrayOfOpenCards.push(event.target);
    return "added";
  } else if (arguments[1] === "matched" || arguments[1] === "up") {
    return "alreadyAddedBefore";
  }
}

function compareTwoCards(event, condition) {
  if (arguments[1] === "added") {
    if (arrayOfOpenCards.length % 2 === 0) {
      let i = arrayOfOpenCards.length - 1;
      if (arrayOfOpenCards[i].innerHTML === arrayOfOpenCards[i - 1].innerHTML) {
        counter++;
        return "comparedMatch";
      } else {
        counter++;
        return "comparedDiff";
      }
    } else {
      return "Odd number";
    }
  } else if (arguments[1] === "alreadyAddedBefore") {
    return "noNewCard";
  }
}

function incrementCounter(event, condition) {
  if (arguments[1] === "comparedMatch" || arguments[1] === "comparedDiff") {
    movesCounter[0].innerHTML = counter;
  }
}

function matchTwoCards(event, condition) {
  let i = arrayOfOpenCards.length - 1;
  let match1 = arrayOfOpenCards[i];
  let match2 = arrayOfOpenCards[i - 1];
  if (arguments[1] === "comparedMatch") {
    setTimeout(function () {
      match1.className = "card match";
      match2.className = "card match";
    }, 300);
    arrayOfMatchedCards.push(arrayOfOpenCards[i - 1]);
    arrayOfMatchedCards.push(arrayOfOpenCards[i]);
    arrayOfOpenCards.pop();
    arrayOfOpenCards.pop();
    return "aNewMatchAdded";
  }
}

function nonMatchingAndFlipDown(event, condition) {
  let i = arrayOfOpenCards.length - 1;
  let nonmatch1 = arrayOfOpenCards[i];
  let nonmatch2 = arrayOfOpenCards[i - 1];
  if (arguments[1] === "comparedDiff") {
    setTimeout(function () {
      nonmatch1.className = "card";
      nonmatch2.className = "card";
    }, 300);
    arrayOfOpenCards.pop();
    arrayOfOpenCards.pop();
    return true;
  }
}

function congratulations(event, condition) {
  if (arguments[1] === "aNewMatchAdded") {
    if (arrayOfMatchedCards.length === 16) {
      clearInterval(startTimer);
      document.getElementById("numMoves").innerHTML = counter;
      document.getElementById("numStars").innerHTML = starRating.length;
      document.getElementById("timeGone").innerHTML = theTime[0].innerText;
      modal.style.display = "block";
    }
  }
}

function formatTime(num) {
  let numString = num + "";
  if (numString.length < 2) {
    return "0" + numString;
  } else {
    return numString;
  }
}

function setTime() {
  ++totalSeconds;
  secSpan.innerHTML = formatTime(totalSeconds % 60);
  minSpan.innerHTML = formatTime(parseInt(totalSeconds / 60));
}

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

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

 document.querySelector(".deck").addEventListener("click",function(){
   if (event.target.nodeName === "LI") {
     event.preventDefault();
     let flip = flipThisCardUp(event);
     let addOpen = addMeToOpenCards(event, flip);
     let compare = compareTwoCards(event, addOpen);
     let matching = matchTwoCards(event, compare);
     let nonmatching = nonMatchingAndFlipDown(event, compare);
     let incCount = incrementCounter(event, compare);
     let congrats = congratulations(event, matching);
   }
   if (eachFlip === 1) {
     startTimer = setInterval(setTime, 1000);
   }
 });
