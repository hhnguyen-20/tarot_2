let deck = Array.from({ length: 78 }, (_, i) => i + 1);
let selectedCards = [];
let shuffleInterval;

function shuffleCards() {
    // ... Your shuffling logic here ...
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
