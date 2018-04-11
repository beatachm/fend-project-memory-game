/*
 * Create a list that holds all of your cards
 */
let cards = [
    "fa-anchor",
    "fa-headphones",
    "fa-camera",
    "fa-music",
    "fa-ambulance",
    "fa-birthday-cake",
    "fa-bicycle",
    "fa-binoculars"
];
cards = cards.concat(cards);
let htmlTemplate =
    '<li class="card"><div class="flipper"><div class="front">' +
    '<i class="fa fa-"></i></div></div></li>';
let deck = document.getElementsByClassName("deck")[0];
let ratingBreakpoints = [15, 25];
let steps = 0;
let highlightedCard = -1;
let matchedCards = [];
let startTime;
let timerInterval;

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length,
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

function reset() {
    cards = shuffle(cards);
    deck.innerHTML = "";
    steps = 0;
    highlightedCard = -1;
    matchedCards = [];
    startTime = undefined;
    cards.forEach(card => {
        deck.innerHTML += htmlTemplate.replace("fa-", card);
    });
    Array.from(document.getElementsByClassName("card")).forEach((card, index) => {
        card.onclick = function () {
            cardClicked(index);
        };
    });
    displayStepsAndRating();
    hideMessage();
    // Start background task that displays game time.
    timerInterval = setInterval(displayTimer, 200);
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
function openCard(cardId) {
    deck.getElementsByTagName("li")[cardId].classList.add("open");
}

function closeCard(cardId) {
    deck.getElementsByTagName("li")[cardId].classList.remove("open");
}

function highlightCard(cardId) {
    highlightedCard = cardId;
    openCard(cardId);
}

function checkMatch(secondCard) {
    openCard(secondCard);
    if (cards[highlightedCard] === cards[secondCard]) {
        matchedCards.push(highlightedCard);
        matchedCards.push(secondCard);
    } else {
        let firstCard = highlightedCard;
        setTimeout(function () {
            closeCard(firstCard);
            closeCard(secondCard);
        }, 1000);
    }
    highlightedCard = -1;
    incrementMove();
}

function incrementMove() {
    steps++;
    displayStepsAndRating();
    checkWinningCondition();
}

function displayStepsAndRating() {
    let starRating = 1;
    ratingBreakpoints.forEach(br => {
        if (br >= steps) {
            starRating++;
        }
    });
    Array.from(document.getElementsByClassName('stars')).forEach(stars => {
        Array.from(stars.getElementsByTagName('i')).forEach((star, index) => {
            if (starRating > index) {
                star.className = "fa fa-star";
            } else {
                star.className = "fa fa-star-o";
            }
        });
    });
    document.getElementsByClassName("moves")[0].innerText = steps;
}

function cardClicked(cardId) {
    let isMatched = matchedCards.indexOf(cardId) >= 0;
    let isHighlighted = highlightedCard == cardId;
    let isAnyCardHighlighted = highlightedCard >= 0;

    if (!isMatched && !isAnyCardHighlighted) {
        highlightCard(cardId);
    } else if (!isMatched && !isHighlighted) {
        checkMatch(cardId);
    }

    // start timer on first click
    if (typeof (startTime) === 'undefined') {
        startTime = new Date();
    }
}

function checkWinningCondition() {
    if (matchedCards.length == cards.length) {
        clearInterval(timerInterval);
        displayEndMessage();
    }
}

function displayEndMessage() {
    let msg = `You completed the game in ${formatTimestamp(new Date() - startTime)} and&nbsp;${steps}&nbsp;steps.`
    document.getElementsByClassName("message-text")[0].innerHTML = msg;
    document.getElementsByClassName("modal")[0].classList.remove("hidden");
}

function hideMessage() {
    document.getElementsByClassName("modal")[0].classList.add("hidden");
}

function formatTimestamp(time) {
    return `${Math.floor(time/3600000).toString().padStart(2,'0')}:${Math.floor(time/60000%60).toString().padStart(2,'0')}:${Math.floor(time/1000%60).toString().padStart(2,'0')}`;
}

function displayTimer() {
    let timeDifference = 0;
    if (typeof (startTime) !== 'undefined') {
        timeDifference = new Date() - startTime
    }
    document.getElementsByClassName("game-time")[0].innerText = formatTimestamp(timeDifference);;
}

reset();