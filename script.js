const grid = document.getElementById('grid');
const message = document.getElementById('message');
const restartBtn = document.getElementById('restartBtn');
const timerElement = document.getElementById('timer');

// List of photo paths
const photos = [
  'images/Aisha_image1.png',
  'images/Aisha_image2.jpg',
  'images/Aisha_image3.png',
  'images/Aisha_image4.jpg',
  'images/Aisha_image5.jpg',
  'images/Aisha_image6.jpg',
  'images/Aisha_image7.jpg',
  'images/Aisha_image8.jpg'
];

let cardsArray = [...photos, ...photos]; // duplicate for pairs

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matches = 0;

// Timer
let seconds = 0;
let timerInterval = null;

// Shuffle cards
cardsArray.sort(() => 0.5 - Math.random());

// Create card elements
function createCards() {
  cardsArray.forEach(photo => {
    const card = document.createElement('div');
    card.classList.add('card', 'cover');

    // Inner container for spin effect
    const cardInner = document.createElement('div');
    cardInner.classList.add('card-inner');

    const cardFront = document.createElement('div');
    cardFront.classList.add('card-front');

    const cardBack = document.createElement('div');
    cardBack.classList.add('card-back');
    const img = document.createElement('img');
    img.src = photo;
    cardBack.appendChild(img);

    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);
    card.appendChild(cardInner);

    card.dataset.photo = photo;
    card.addEventListener('click', flipCard);
    grid.appendChild(card);
  });
}
createCards();

// Start timer
function startTimer() {
  if (!timerInterval) {
    timerInterval = setInterval(() => {
      seconds++;
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      timerElement.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
    }, 1000);
  }
}

// Stop timer
function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

// Flip card
function flipCard() {
  if (lockBoard || this === firstCard) return;

  // Start timer on first click
  if (seconds === 0) startTimer();

  this.classList.add('flipped');
  this.classList.remove('cover');

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  lockBoard = true;

  checkMatch();
}

// Check for match
function checkMatch() {
  if (firstCard.dataset.photo === secondCard.dataset.photo) {
    createHeart(firstCard);
    createHeart(secondCard);

    matches += 1;
    resetBoard();

    // Check if all pairs are matched
    if (matches === photos.length) {
      stopTimer();

      // Ensure the prompt happens after DOM updates
      setTimeout(() => {
        message.textContent = `🎉 You matched all photos! Time: ${timerElement.textContent} 🎉`;
      }, 100); // small delay ensures all animations finish
    }
  } else {
    setTimeout(() => {
      firstCard.classList.remove('flipped');
      firstCard.classList.add('cover');
      secondCard.classList.remove('flipped');
      secondCard.classList.add('cover');
      resetBoard();
    }, 1000);
  }
}


// Reset board variables
function resetBoard() {
  [firstCard, secondCard, lockBoard] = [null, null, false];
}

// Create floating heart animation
function createHeart(card) {
  const rect = card.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;

  const heart = document.createElement('div');
  heart.classList.add('heart');
  heart.style.left = `${x}px`;
  heart.style.top = `${y}px`;
  heart.textContent = '💖';
  document.body.appendChild(heart);

  setTimeout(() => heart.remove(), 1000); // remove after animation
}

// Restart button
restartBtn.addEventListener('click', () => {
  grid.innerHTML = '';
  cardsArray.sort(() => 0.5 - Math.random());
  matches = 0;
  message.textContent = '';
  seconds = 0;
  timerElement.textContent = "0:00";
  clearInterval(timerInterval);
  timerInterval = null;
  createCards();
});
