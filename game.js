document.addEventListener('DOMContentLoaded', function() {
    // Get wish ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const wishId = urlParams.get('id');
    
    // If no wish ID, redirect to home
    if (!wishId) {
        window.location.href = 'index.html';
        return;
    }
    
    // Get wish data from localStorage
    const wishData = JSON.parse(localStorage.getItem(`wish_${wishId}`));
    
    // If no wish data, redirect to home
    if (!wishData) {
        window.location.href = 'index.html';
        return;
    }
    
    // Update game intro with friend's name
    const gameIntro = document.getElementById('gameIntro');
    if (gameIntro) {
        gameIntro.textContent = `Win this game to see ${wishData.friendName}'s special birthday message!`;
    }
    
    // Game elements
    const gameBoard = document.getElementById('gameBoard');
    const startGameBtn = document.getElementById('startGameBtn');
    const restartGameBtn = document.getElementById('restartGameBtn');
    const movesElement = document.getElementById('moves');
    const pairsElement = document.getElementById('pairs');
    const gameResult = document.getElementById('gameResult');
    const winResult = document.getElementById('winResult');
    const loseResult = document.getElementById('loseResult');
    const viewMessageBtn = document.getElementById('viewMessageBtn');
    const tryAgainBtn = document.getElementById('tryAgainBtn');
    
    // Game state
    let cards = [];
    let flippedCards = [];
    let matchedPairs = 0;
    let moves = 0;
    let canFlip = false;
    const totalPairs = 8;
    
    // Card images (birthday themed)
    const cardImages = [
        { name: 'cake', emoji: '🎂' },
        { name: 'gift', emoji: '🎁' },
        { name: 'balloon', emoji: '🎈' },
        { name: 'party', emoji: '🎉' },
        { name: 'confetti', emoji: '🎊' },
        { name: 'hat', emoji: '🎩' },
        { name: 'candle', emoji: '🕯️' },
        { name: 'sparkles', emoji: '✨' }
    ];
    
    // Initialize game
    function initGame() {
        // Reset game state
        cards = [];
        flippedCards = [];
        matchedPairs = 0;
        moves = 0;
        canFlip = true;
        
        // Update UI
        movesElement.textContent = moves;
        pairsElement.textContent = matchedPairs;
        gameBoard.innerHTML = '';
        
        // Create card pairs
        const cardPairs = [...cardImages, ...cardImages];
        
        // Shuffle cards
        shuffleArray(cardPairs);
        
        // Create card elements
        cardPairs.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.className = 'memory-card';
            cardElement.dataset.cardName = card.name;
            
            const front = document.createElement('div');
            front.className = 'front';
            front.innerHTML = card.emoji;
            
            const back = document.createElement('div');
            back.className = 'back';
            back.innerHTML = '?';
            
            cardElement.appendChild(front);
            cardElement.appendChild(back);
            
            cardElement.addEventListener('click', () => flipCard(cardElement));
            
            gameBoard.appendChild(cardElement);
            cards.push(cardElement);
        });
    }
    
    // Flip card
    function flipCard(card) {
        if (!canFlip) return;
        if (card.classList.contains('flipped') || card.classList.contains('matched')) return;
        if (flippedCards.length === 2) return;
        
        // Flip the card
        card.classList.add('flipped');
        flippedCards.push(card);
        
        // Check for match if two cards are flipped
        if (flippedCards.length === 2) {
            moves++;
            movesElement.textContent = moves;
            
            const [card1, card2] = flippedCards;
            
            if (card1.dataset.cardName === card2.dataset.cardName) {
                // Match found
                matchedPairs++;
                pairsElement.textContent = matchedPairs;
                
                card1.classList.add('matched');
                card2.classList.add('matched');
                
                flippedCards = [];
                
                // Check if game is won
                if (matchedPairs === totalPairs) {
                    setTimeout(() => {
                        endGame(true);
                    }, 1000);
                }
            } else {
                // No match
                canFlip = false;
                setTimeout(() => {
                    card1.classList.remove('flipped');
                    card2.classList.remove('flipped');
                    flippedCards = [];
                    canFlip = true;
                    
                    // Check if game is lost (too many moves)
                    if (moves >= 25) {
                        endGame(false);
                    }
                }, 1000);
            }
        }
    }
    
    // End game
    function endGame(isWin) {
        gameResult.classList.remove('hidden');
        
        if (isWin) {
            winResult.classList.remove('hidden');
            loseResult.classList.add('hidden');
            
            // Mark as completed in localStorage
            wishData.gameCompleted = true;
            localStorage.setItem(`wish_${wishId}`, JSON.stringify(wishData));
        } else {
            winResult.classList.add('hidden');
            loseResult.classList.remove('hidden');
        }
    }
    
    // Shuffle array (Fisher-Yates algorithm)
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    // Event listeners
    if (startGameBtn) {
        startGameBtn.addEventListener('click', function() {
            initGame();
            startGameBtn.classList.add('hidden');
            restartGameBtn.classList.remove('hidden');
        });
    }
    
    if (restartGameBtn) {
        restartGameBtn.addEventListener('click', function() {
            initGame();
        });
    }
    
    if (viewMessageBtn) {
        viewMessageBtn.addEventListener('click', function() {
            window.location.href = `message.html?id=${wishId}`;
        });
    }
    
    if (tryAgainBtn) {
        tryAgainBtn.addEventListener('click', function() {
            gameResult.classList.add('hidden');
            initGame();
        });
    }
});
