/*
 * Create a list that holds all of your cards
 */

let deckOfCardsArray = Array.from(document.getElementsByClassName("card"));
let arrayOfOpenCards = [];
let arrayOfMatchedCards = [];
let eachFlip = 0;   //  Each card flip up counter
let counter = 0;    //  Actual number of moves counter
let movesCounter = Array.from(document.getElementsByClassName("moves"));
let minSpan = document.getElementById("minutes");
let secSpan = document.getElementById("seconds");
let totalSeconds = 0;   //  A timer variable
let startTimer;
let theTime = Array.from(document.getElementsByClassName("tim"));
let modal = document.getElementById("theModal");
let starScore = document.querySelector(".stars");
let starRating = Array.from(document.getElementsByClassName("fa-star"));
let starHTML = starScore.innerHTML;
let theDeck = document.querySelector(".deck");

//  function will flip a card face up
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

//  Add the flipped up card above to the array
function addMeToOpenCards(event, condition) {
  if (arguments[1] === "flipped") {
    arrayOfOpenCards.push(event.target);
    return "added";
  } else if (arguments[1] === "matched" || arguments[1] === "up") {
    return "alreadyAddedBefore";
  }
}

//  When two different cards are flipped up successively, compare them
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

//    Number of moves counter, after comparing two cards (i.e. a full move)
function incrementCounter(event, condition) {
  if (arguments[1] === "comparedMatch" || arguments[1] === "comparedDiff") {
    movesCounter[0].innerHTML = counter;
    return "countIncreased"
  }
}

//  After comparing two card, if they match, lock them face up, add them to matched cards array and remove them from open cards array
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

//  After comparing two card, if they do not match, flip them face down and remove them from open cards array
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

//    Decide what star rating to give the user depending on the number of moves he/she has done
function ratingStars(event, condition) {
  if (arguments[1] === "countIncreased") {
    if (counter >= 17 && counter <= 27) {
      let i = starRating.length - 1;
      if (i === 2) {
        starRating[i].remove();
        starRating.pop();
      }
    } else if (counter > 27) {
      let i = starRating.length - 1;
      if (i === 1) {
        starRating[i].remove();
        starRating.pop();
      }
    }
  }
}

//    When all cards are matched, stop the timer and display the congratulations modal to the user with all his game record information
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

//    Function displays the time elapsed in the shown format on web app (i.e 02:16)
function formatTime(num) {
  let numString = num.toString();
  if (numString.length < 2) {
    return "0" + numString;
  } else {
    return numString;
  }
}

//    Functions that kickstarts the timer for the game
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

    // Function takes in the deck of cards selector and the new shuffled array of cards
    // It remove all children of theDeck and then append HTML elements that represent the new shuffled cards
function reshuffleTheDeck(theDeck, shuffledVersion) {
	for (i = 0; i<15; i++) {
		theDeck.lastElementChild.remove();
	}
	for(i = 0; i<16; i++) {
		theDeck.appendChild(shuffledVersion[i]);
	}
}

//    Shuffling call
reshuffleTheDeck(theDeck, shuffle(deckOfCardsArray));

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
     let rate = ratingStars(event, incCount);
     let congrats = congratulations(event, matching);
   }
   if (eachFlip === 1) {    //   When the user flips open the first card, fire the timer
     startTimer = setInterval(setTime, 1000);
   }
 });

  //    Two event listeners for the restart button and the play again button of the modal that reset all the variables and flips down all cards and shuffles them
 document.querySelector(".restart").addEventListener("click", function() {
   clearInterval(startTimer);
   totalSeconds = 0;
   secSpan.innerHTML = formatTime(totalSeconds % 60);
   minSpan.innerHTML = formatTime(parseInt(totalSeconds / 60));
   counter = 0;
   movesCounter[0].innerHTML = counter;
   eachFlip = 0;
   arrayOfOpenCards = [];
   arrayOfMatchedCards = [];
   deckOfCardsArray.forEach(function(card, index){
     deckOfCardsArray[index].className = "card";
   });
   starScore.innerHTML = starHTML;
   starRating = Array.from(document.getElementsByClassName("fa-star"));
   reshuffleTheDeck(theDeck, shuffle(deckOfCardsArray));
 });

 document.querySelector("#playAgain").addEventListener("click", function() {
   totalSeconds = 0;
   secSpan.innerHTML = formatTime(totalSeconds % 60);
   minSpan.innerHTML = formatTime(parseInt(totalSeconds / 60));
   counter = 0;
   movesCounter[0].innerHTML = counter;
   eachFlip = 0;
   arrayOfOpenCards = [];
   arrayOfMatchedCards = [];
   clearInterval(startTimer);
   deckOfCardsArray.forEach(function(card, index){
     deckOfCardsArray[index].className = "card";
   });
   modal.style.display = "none";  //  Hide the modal after requesting to play again
   starScore.innerHTML = starHTML;
   starRating = Array.from(document.getElementsByClassName("fa-star"));
   reshuffleTheDeck(theDeck, shuffle(deckOfCardsArray));
 });

  document.querySelector(".close").addEventListener("click", function() {
    modal.style.display = "none";
  });
