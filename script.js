let deck = Array.from({ length: 78 }, (_, i) => i + 1);
let selectedCards = [];
let shuffleInterval;

function shuffleCards() {
    if (shuffleInterval) {
        clearInterval(shuffleInterval);
        shuffleInterval = null;
        document.getElementById('shuffleButton').textContent = 'Start Shuffling';
    } else {
        shuffleArray(deck); // Shuffle the deck
        shuffleAndRenderDeck(); // Visually shuffle the cards on the page
        document.getElementById('shuffleButton').textContent = 'Stop Shuffling';

        shuffleInterval = setInterval(() => {
            shuffleArray(deck);
            shuffleAndRenderDeck();
        }, 1000);
    }
}
// Fisher-Yates shuffle algorithm
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // swap elements
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

        const backImg = document.createElement('img');
        backImg.className = 'back_side';
        backImg.src = "{{ url_for('static', filename='images/78.jpg') }}";

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

        card.style.transform = '';
    });
}

function goToResultPage() {
    if (selectedCards.length < 5) {
        alert("Please select 5 cards.");
        return;
    }

    document.querySelector('.card_container').innerHTML = '';

    selectedCards.forEach(cardNum => {
        const cardImg = document.createElement('img');
        cardImg.src = `images/${cardNum}.jpg`;
        document.querySelector('.card_container').appendChild(cardImg);
    });
}


let selectedCards = [];
let maxSelectableCards = 5;

function flipCard(card) {
    if (selectedCards.length < maxSelectableCards || card.classList.contains("flipped")) {
        card.classList.toggle("flipped");
        updateSelectedCards(card);
    }
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
    const selectedCardsInfo = document.getElementById("selected_cards_info");
    const selectedCardsDetails = document.getElementById("selected_cards_details");
    const toast = document.getElementById("toast");

    selectedCardsDetails.innerHTML = "";

    if (selectedCards.length === maxSelectableCards) {
        selectedCardsInfo.style.display = "block";
        for (const card of selectedCards) {
            const cardInfo = document.createElement("p");
            cardInfo.textContent = card;
            selectedCardsDetails.appendChild(cardInfo);
        }

        // Disable click event for all cards
        const cards = document.getElementsByClassName("card");
        for (const card of cards) {
            card.style.pointerEvents = "none";
        }

        // Show the toast message
        showToast(toast);
    } else {
        selectedCardsInfo.style.display = "none";
    }
}

function showToast(toast) {
    toast.className = "toast show";
    setTimeout(function () { toast.className = toast.className.replace("show", ""); }, 3000);
}
// Before navigating to the result page
function saveSelectedCardsToServer() {
    fetch('/save-cards', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cards: selectedCards })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = "{{ url_for('result') }}";
            } else {
                alert("Error saving cards. Try again.");
            }
        });
}







