const baseURL = "images/";

let deck = Array.from({ length: 78 }, (_, i) => i);
let selectedCards = [];
let shuffleInterval;

function shuffleCards() {
    if (shuffleInterval) {
        clearInterval(shuffleInterval);
        shuffleInterval = null;
        document.querySelector('button[onclick="shuffleCards()"]').textContent = 'Start Shuffling';
    } else {
        shuffleArray(deck); // Shuffle the deck
        shuffleAndRenderDeck(); // Visually shuffle the cards on the page
        document.querySelector('button[onclick="shuffleCards()"]').textContent = 'Stop Shuffling';
        shuffleInterval = setInterval(() => {
            shuffleArray(deck);
            shuffleAndRenderDeck();
        }, 1000);
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function renderDeck() {
    const container = document.querySelector('.card_container');
    container.innerHTML = '';
    for (const cardNum of deck) {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card';
        cardDiv.onclick = () => flipCard(cardDiv);

        const frontImg = document.createElement('img');
        frontImg.className = 'front_side';
        frontImg.src = baseURL + cardNum + ".jpg";
        frontImg.alt = "Tarot Card " + cardNum;


        const backImg = document.createElement('img');
        backImg.className = 'back_side';
        backImg.src = baseURL + "78.jpg";

        cardDiv.appendChild(frontImg);
        cardDiv.appendChild(backImg);
        container.appendChild(cardDiv);
    }
}



function shuffleAndRenderDeck() {
    const cards = Array.from(document.querySelectorAll('.card'));

    // Step 1: Get initial positions
    const cardPositions = cards.map(card => ({ x: card.offsetLeft, y: card.offsetTop }));

    // Step 2: Shuffle the cards array
    shuffleArray(cards);

    // Step 3: Append cards to the container in shuffled order. 
    const cardContainer = document.querySelector('.card_container');
    cards.forEach(card => {
        cardContainer.appendChild(card);
    });

    // Step 4: Compare initial positions to new positions, and animate
    cards.forEach((card, index) => {
        const newPosition = { x: card.offsetLeft, y: card.offsetTop };
        const oldPosition = cardPositions[index];

        card.style.transform = `translate(${oldPosition.x - newPosition.x}px, ${oldPosition.y - newPosition.y}px)`;

        // Force a reflow to make sure the transform takes effect before the transition
        void card.offsetWidth;

        card.style.transition = 'transform 0.5s';  // Added this line
        card.style.transform = '';
    });
}


function goToResultPage() {
    if (selectedCards.length < 5) {
        alert("Please select 5 cards.");
        return;
    }

    localStorage.setItem('selectedCards', JSON.stringify(selectedCards));
    window.location = "result.html";  // Assumes result.html is in the same directory
}





let maxSelectableCards = 5;

function flipCard(card) {
    if (selectedCards.length < maxSelectableCards || card.classList.contains("flipped")) {
        card.classList.toggle("flipped");
        updateSelectedCards(card);
    }
}

function updateSelectedCards(card) {
    const cardNumber = card.querySelector(".front_side").src.split('/').pop().split('.')[0];  // Extract card number from the image src
    if (card.classList.contains("flipped")) {
        selectedCards.push(cardNumber);
    } else {
        const cardIndex = selectedCards.indexOf(cardNumber);
        if (cardIndex !== -1) {
            selectedCards.splice(cardIndex, 1);
        }
    }
    showSelectedCardsInfo();
}


function updateSelectedCards(card) {
    if (card.classList.contains("flipped")) {
        selectedCards.push(card.querySelector(".front_side").alt);
    } else {
        const cardIndex = selectedCards.indexOf(card.querySelector(".front_side").alt);
        if (cardIndex !== -1) {
            selectedCards.splice(cardIndex, 1);
        }
    }
    showSelectedCardsInfo();
}

function showSelectedCardsInfo() {
    const infoDiv = document.getElementById('cardInfo');
    infoDiv.innerHTML = "";

    if (selectedCards.length === maxSelectableCards) {
        for (const card of selectedCards) {
            const cardInfo = document.createElement("p");
            cardInfo.textContent = card;
            infoDiv.appendChild(cardInfo);
        }

        const cards = document.getElementsByClassName("card");
        for (const card of cards) {
            card.style.pointerEvents = "none";
        }
    } else {
        infoDiv.innerHTML = ""; // Clear the info if less than max selectable cards
    }
}


// Use this function on page load to render the cards
window.onload = renderDeck;


document.addEventListener("DOMContentLoaded", function() {
    if (window.location.pathname.endsWith("result.html")) {
        loadResultPage();
    } else if (window.location.pathname.endsWith("index.html")) {
        renderDeck();
    }
});

let currentCardIndex = 0;

function loadResultPage() {
    selectedCards = JSON.parse(localStorage.getItem('selectedCards') || "[]");
    if (selectedCards.length === 0) {
        alert("No cards selected. Redirecting...");
        window.location = "index.html";
    }
    displayCard();

    document.getElementById("nextButton").addEventListener("click", function() {
        currentCardIndex++;
        if (currentCardIndex >= selectedCards.length) {
            alert("You've viewed all the cards!");
            // Redirect to index.html or any other action
            window.location = "index.html";
            return;
        }
        displayCard();
    });
}

function displayCard() {
    const imgElem = document.getElementById("resultImage");
    const cardNumber = selectedCards[currentCardIndex].split(' ').pop(); // Extract card number from the image alt
    imgElem.src = baseURL + cardNumber + ".jpg";
}
