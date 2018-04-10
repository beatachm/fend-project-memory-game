/*
 * Create a list that holds all of your cards
 */
var cards = [
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
var htmlTemplate =
        '<li class="card"><div class="flipper"><div class="front">'+
        '<i class="fa fa-"></i></div></div></li>';
var deck = document.getElementById("deck");
var stars = document.getElementById("stars").getElementsByTagName("i");
var ratingBreakpoints = [10,20,30];
var steps = 0;
var highlightedCard = -1;
var matchedCards = [];
var startTime;

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

function reset(){
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
        card.onclick = function(){
            cardClicked(index, matchedCards, highlightCard);
        };
    });
    displayStepsAndRating();
    hideMessage();
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
function openCard(cardId){
    deck.getElementsByTagName("li")[cardId].classList.add("open");
}

function closeCard(cardId){
    deck.getElementsByTagName("li")[cardId].classList.remove("open");
}

function highlightCard(cardId){
    highlightedCard = cardId;
    openCard(cardId);
}

function checkMatch(secondCard){
    openCard(secondCard);
    if(cards[highlightedCard] === cards[secondCard]){
        matchedCards.push(highlightedCard);
        matchedCards.push(secondCard);
    }
    else{
        var firstCard = highlightedCard;
        setTimeout(function(){
            closeCard(firstCard);
            closeCard(secondCard);
        }, 1000);
    }
    highlightedCard = -1;
    incrementMove();
}

function incrementMove(){
    steps++;
    displayStepsAndRating();
    checkWinningCondition();
}

function displayStepsAndRating(){
    var starRating = 0;
    ratingBreakpoints.forEach(br => {
        if(br >= steps){
            starRating++;
        }
    });
    Array.from(stars).forEach((star, index) => {
        if(starRating > index){
            star.className = "fa fa-star";
        }
        else{
            star.className = "fa fa-star-o";
        }
    });
    document.getElementById("moves").innerText = steps;
}

function cardClicked(cardId){
    var isMatched = matchedCards.indexOf(cardId) >= 0;
    var isHighlighted = highlightedCard == cardId;
    var isAnyCardHighlighted = highlightedCard >= 0;

    if(!isMatched && !isAnyCardHighlighted){
        highlightCard(cardId);
    }
    else if (!isMatched && !isHighlighted){
        checkMatch(cardId);
    }

    // start timer on first click
    if(typeof(startTime) === 'undefined'){
        startTime = new Date();
    }
}

function checkWinningCondition(){
    if(matchedCards.length == cards.length){
        displayEndMessage();
    }
}

function displayEndMessage(){
    var elapsedTime = Math.round((new Date() - startTime) / 1000);
    var msg = `Congratulations! You completed the game in ${elapsedTime}s and ${steps} steps.`
    document.getElementsByClassName("message")[0].innerText = msg;
    document.getElementsByClassName("modal")[0].classList.remove("hidden");
}

function hideMessage(){
    document.getElementsByClassName("modal")[0].classList.add("hidden");
}

reset();