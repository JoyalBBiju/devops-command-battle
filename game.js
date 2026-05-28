// =====================================================
// DevOps Command Battle - Game Logic
// =====================================================

/**
 * Game State Management
 * Tracks all game-related data and statistics
 */
const gameState = {
    score: 0,
    streak: 0,
    maxStreak: 0,
    level: 1,
    totalAttempts: 0,
    correctAnswers: 0,
    currentChallenge: null,
    gameActive: false,
    hintsUsed: 0,
    skipped: 0,
    categoryStats: {},
    challengeHistory: []
};

/**
 * Game Configuration
 */
const gameConfig = {
    baseScore: 10,
    hintPenalty: 5,
    skipPenalty: 0,
    streakMultiplier: 0.5,
    levelUpThreshold: 5,
    maxLevel: 5
};

// =====================================================
// CHALLENGE LOADING FUNCTIONS
// =====================================================

/**
 * Get all available challenges
 * @returns {Array} Array of challenge objects
 */
function getAllChallenges() {
    return devopsCommands || [];
}

/**
 * Get random challenge from the pool
 * @returns {Object} Random challenge object
 */
function getRandomChallenge() {
    const challenges = getAllChallenges();
    if (challenges.length === 0) {
        console.error('No challenges available');
        return null;
    }
    const randomIndex = Math.floor(Math.random() * challenges.length);
    return challenges[randomIndex];
}

/**
 * Get challenges by difficulty level
 * @param {String} difficulty - Difficulty level
 * @returns {Array} Filtered challenges
 */
function getChallengesByDifficulty(difficulty) {
    const challenges = getAllChallenges();
    return challenges.filter(c => c.difficulty.toLowerCase() === difficulty.toLowerCase());
}

/**
 * Get challenges by category
 * @param {String} category - Category name
 * @returns {Array} Filtered challenges
 */
function getChallengesByCategory(category) {
    const challenges = getAllChallenges();
    return challenges.filter(c => c.category === category);
}

/**
 * Get difficulty based on current level and streak
 * @returns {String} Recommended difficulty
 */
function getDifficultyForLevel() {
    if (gameState.streak >= 15) return 'Master';
    if (gameState.streak >= 10) return 'Expert';
    if (gameState.streak >= 5) return 'Advanced';
    if (gameState.streak >= 3) return 'Intermediate';
    return 'Beginner';
}

/**
 * Load next challenge with smart difficulty selection
 */
function loadNextChallenge() {
    // Clear UI
    const commandInput = document.getElementById('commandInput');
    const feedback = document.getElementById('feedback');
    const hintElement = document.getElementById('hint');

    commandInput.value = '';
    feedback.classList.remove('show', 'success', 'error', 'warning');
    hintElement.classList.remove('show');
    if (hintElement) hintElement.style.display = 'none';

    // Try to get challenge by difficulty level for progressive difficulty
    const targetDifficulty = getDifficultyForLevel();
    let challengePool = getChallengesByDifficulty(targetDifficulty);

    // If no challenges for that difficulty, get random
    if (challengePool.length === 0) {
        challengePool = getAllChallenges();
    }

    // Select random challenge from pool
    if (challengePool.length === 0) {
        showFeedback('No challenges available!', 'error');
        return;
    }

    gameState.currentChallenge = challengePool[Math.floor(Math.random() * challengePool.length)];

    // Update difficulty level based on streak
    updateLevel();

    // Display the challenge
    displayChallenge();

    // Enable input and buttons
    enableGameControls();
    
    // Focus on input
    commandInput.focus();
}

/**
 * Display current challenge on screen
 */
function displayChallenge() {
    if (!gameState.currentChallenge) return;

    const challenge = gameState.currentChallenge;
    const problemDisplay = document.getElementById('problem');
    const difficultyContainer = document.getElementById('difficultyContainer');
    const challengeCounter = document.getElementById('challengeCounter');
    const categoryLabel = document.getElementById('categoryLabel');

    // Display question
    problemDisplay.textContent = challenge.question;

    // Display difficulty badge with color coding
    difficultyContainer.innerHTML = `<div class="difficulty-level ${challenge.difficulty.toLowerCase()}">
        📊 Difficulty: ${challenge.difficulty} | Category: ${challenge.category}
    </div>`;

    // Display challenge counter
    const challengeNum = challenge.id || 'N/A';
    challengeCounter.textContent = `Challenge #${challengeNum} | Level ${gameState.level} | Streak: ${gameState.streak}`;
}

// =====================================================
// ANSWER CHECKING FUNCTIONS
// =====================================================

/**
 * Normalize command for comparison
 * @param {String} command - Command to normalize
 * @returns {String} Normalized command
 */
function normalizeCommand(command) {
    return command.trim().toLowerCase();
}

/**
 * Check if user's answer is correct
 * @param {String} userAnswer - User's input command
 * @returns {Boolean} True if answer is correct
 */
function isAnswerCorrect(userAnswer) {
    if (!gameState.currentChallenge) return false;

    const normalizedUserAnswer = normalizeCommand(userAnswer);
    const correctAnswers = gameState.currentChallenge.correctCommand.map(cmd => normalizeCommand(cmd));

    // Exact match
    if (correctAnswers.includes(normalizedUserAnswer)) {
        return true;
    }

    // Partial match (for commands with optional flags)
    for (let correctAnswer of correctAnswers) {
        if (normalizedUserAnswer.includes(correctAnswer) || correctAnswer.includes(normalizedUserAnswer)) {
            // Additional validation to avoid false positives
            if (normalizedUserAnswer.length > 3 && correctAnswer.length > 3) {
                return true;
            }
        }
    }

    return false;
}

/**
 * Check user's answer and handle result
 */
function checkAnswer() {
    const commandInput = document.getElementById('commandInput');
    const userAnswer = commandInput.value.trim();

    if (!userAnswer) {
        showFeedback('Please enter a command!', 'warning');
        return;
    }

    if (!gameState.currentChallenge) {
        showFeedback('No active challenge!', 'error');
        return;
    }

    gameState.totalAttempts++;

    if (isAnswerCorrect(userAnswer)) {
        handleCorrectAnswer();
    } else {
        handleIncorrectAnswer();
    }

    updateUI();
}

/**
 * Handle correct answer
 */
function handleCorrectAnswer() {
    // Calculate score
    const baseScore = gameConfig.baseScore;
    const levelBonus = gameState.level * 5;
    const streakBonus = Math.floor(gameState.streak * gameConfig.streakMultiplier);
    const totalScore = baseScore + levelBonus + streakBonus;

    gameState.score += totalScore;
    gameState.streak++;
    gameState.correctAnswers++;

    // Update max streak
    if (gameState.streak > gameState.maxStreak) {
        gameState.maxStreak = gameState.streak;
    }

    // Update category stats
    if (gameState.currentChallenge.category) {
        if (!gameState.categoryStats[gameState.currentChallenge.category]) {
            gameState.categoryStats[gameState.currentChallenge.category] = {
                correct: 0,
                total: 0
            };
        }
        gameState.categoryStats[gameState.currentChallenge.category].correct++;
        gameState.categoryStats[gameState.currentChallenge.category].total++;
    }

    // Add to history
    gameState.challengeHistory.push({
        challengeId: gameState.currentChallenge.id,
        correct: true,
        score: totalScore,
        timestamp: new Date()
    });

    // Show feedback
    const message = `✓ Correct! +${totalScore} points (Base: ${baseScore} + Level: ${levelBonus} + Streak: ${streakBonus})`;
    showFeedback(message, 'success');

    // Disable input and show next button
    disableGameControls();
    updateNextButton();
}

/**
 * Handle incorrect answer
 */
function handleIncorrectAnswer() {
    gameState.streak = 0;

    // Update category stats
    if (gameState.currentChallenge.category) {
        if (!gameState.categoryStats[gameState.currentChallenge.category]) {
            gameState.categoryStats[gameState.currentChallenge.category] = {
                correct: 0,
                total: 0
            };
        }
        gameState.categoryStats[gameState.currentChallenge.category].total++;
    }

    // Add to history
    gameState.challengeHistory.push({
        challengeId: gameState.currentChallenge.id,
        correct: false,
        score: 0,
        timestamp: new Date()
    });

    showFeedback('✗ Incorrect! Try again or get a hint.', 'error');
    
    const commandInput = document.getElementById('commandInput');
    commandInput.value = '';
    commandInput.focus();
}

// =====================================================
// SCORE AND STATS FUNCTIONS
// =====================================================

/**
 * Calculate current level based on streak
 */
function updateLevel() {
    const streakThreshold = gameConfig.levelUpThreshold;
    const newLevel = Math.min(
        1 + Math.floor(gameState.streak / streakThreshold),
        gameConfig.maxLevel
    );
    gameState.level = newLevel;
}

/**
 * Calculate accuracy percentage
 * @returns {Number} Accuracy percentage
 */
function calculateAccuracy() {
    if (gameState.totalAttempts === 0) return 0;
    return Math.round((gameState.correctAnswers / gameState.totalAttempts) * 100);
}

/**
 * Get category success rate
 * @param {String} category - Category name
 * @returns {Number} Success percentage
 */
function getCategorySuccessRate(category) {
    const stats = gameState.categoryStats[category];
    if (!stats || stats.total === 0) return 0;
    return Math.round((stats.correct / stats.total) * 100);
}

/**
 * Get all category statistics
 * @returns {Object} Category statistics
 */
function getAllCategoryStats() {
    const stats = {};
    for (let category in gameState.categoryStats) {
        stats[category] = {
            correct: gameState.categoryStats[category].correct,
            total: gameState.categoryStats[category].total,
            percentage: getCategorySuccessRate(category)
        };
    }
    return stats;
}

/**
 * Update UI with current game state
 */
function updateUI() {
    const scoreDisplay = document.getElementById('score');
    const streakDisplay = document.getElementById('streak');
    const levelDisplay = document.getElementById('level');
    const accuracyDisplay = document.getElementById('accuracy');

    if (scoreDisplay) scoreDisplay.textContent = gameState.score;
    if (streakDisplay) streakDisplay.textContent = gameState.streak;
    if (levelDisplay) levelDisplay.textContent = gameState.level;
    if (accuracyDisplay) {
        const accuracy = calculateAccuracy();
        accuracyDisplay.textContent = accuracy + '%';
    }
}

// =====================================================
// HINT AND SKIP FUNCTIONS
// =====================================================

/**
 * Show hint for current challenge
 */
function showHint() {
    if (!gameState.currentChallenge) return;

    const hintElement = document.getElementById('hint');
    const hintBtn = document.getElementById('hintBtn');

    hintElement.textContent = `💡 Hint: ${gameState.currentChallenge.hint}`;
    hintElement.classList.add('show');
    hintElement.style.display = 'block';

    // Deduct score for hint
    gameState.score = Math.max(0, gameState.score - gameConfig.hintPenalty);
    gameState.hintsUsed++;

    // Disable hint button
    hintBtn.disabled = true;

    updateUI();
}

/**
 * Skip current challenge
 */
function skipCurrentChallenge() {
    gameState.streak = 0;
    gameState.skipped++;

    // Add to history
    gameState.challengeHistory.push({
        challengeId: gameState.currentChallenge.id,
        correct: false,
        skipped: true,
        score: 0,
        timestamp: new Date()
    });

    showFeedback('⊘ Challenge skipped. Moving to next...', 'warning');
    
    setTimeout(() => {
        loadNextChallenge();
    }, 1000);
}

// =====================================================
// UI CONTROL FUNCTIONS
// =====================================================

/**
 * Enable game controls
 */
function enableGameControls() {
    const commandInput = document.getElementById('commandInput');
    const submitBtn = document.getElementById('submitBtn');
    const hintBtn = document.getElementById('hintBtn');
    const skipBtn = document.getElementById('skipBtn');

    commandInput.disabled = false;
    submitBtn.disabled = false;
    hintBtn.disabled = false;
    skipBtn.disabled = false;
}

/**
 * Disable game controls
 */
function disableGameControls() {
    const commandInput = document.getElementById('commandInput');
    const submitBtn = document.getElementById('submitBtn');
    const hintBtn = document.getElementById('hintBtn');
    const skipBtn = document.getElementById('skipBtn');

    commandInput.disabled = true;
    submitBtn.disabled = false;
    hintBtn.disabled = true;
    skipBtn.disabled = true;
}

/**
 * Update next button for challenge progression
 */
function updateNextButton() {
    const submitBtn = document.getElementById('submitBtn');
    const originalText = 'Submit Answer';
    
    submitBtn.textContent = 'Next Challenge →';
    submitBtn.onclick = (e) => {
        e.preventDefault();
        submitBtn.textContent = originalText;
        submitBtn.onclick = null;
        loadNextChallenge();
    };
}

/**
 * Show feedback message
 * @param {String} message - Feedback message
 * @param {String} type - Message type (success, error, warning)
 */
function showFeedback(message, type = 'info') {
    const feedback = document.getElementById('feedback');
    
    feedback.textContent = message;
    feedback.className = `feedback show ${type}`;
    
    // Auto-hide after 5 seconds (except for success which waits for next button)
    if (type !== 'success') {
        setTimeout(() => {
            feedback.classList.remove('show');
        }, 5000);
    }
}

// =====================================================
// GAME START/END FUNCTIONS
// =====================================================

/**
 * Start the game
 */
function startGame() {
    gameState.gameActive = true;
    const startBtn = document.getElementById('startBtn');
    if (startBtn) startBtn.style.display = 'none';
    
    loadNextChallenge();
    updateUI();
}

/**
 * End the game and show statistics
 */
function endGame() {
    gameState.gameActive = false;
    disableGameControls();
    showGameStatistics();
}

/**
 * Show game statistics summary
 */
function showGameStatistics() {
    const stats = {
        totalScore: gameState.score,
        totalAttempts: gameState.totalAttempts,
        correctAnswers: gameState.correctAnswers,
        accuracy: calculateAccuracy(),
        maxStreak: gameState.maxStreak,
        currentStreak: gameState.streak,
        level: gameState.level,
        hintsUsed: gameState.hintsUsed,
        skipped: gameState.skipped,
        categoryStats: getAllCategoryStats(),
        challengeHistory: gameState.challengeHistory
    };

    console.log('Game Statistics:', stats);
    return stats;
}

/**
 * Reset game state
 */
function resetGame() {
    gameState.score = 0;
    gameState.streak = 0;
    gameState.maxStreak = 0;
    gameState.level = 1;
    gameState.totalAttempts = 0;
    gameState.correctAnswers = 0;
    gameState.currentChallenge = null;
    gameState.gameActive = false;
    gameState.hintsUsed = 0;
    gameState.skipped = 0;
    gameState.categoryStats = {};
    gameState.challengeHistory = [];

    updateUI();

    const startBtn = document.getElementById('startBtn');
    if (startBtn) startBtn.style.display = 'block';
    
    const commandInput = document.getElementById('commandInput');
    if (commandInput) commandInput.value = '';
}

// =====================================================
// EVENT LISTENERS
// =====================================================

/**
 * Initialize event listeners when DOM is ready
 */
function initializeEventListeners() {
    const startBtn = document.getElementById('startBtn');
    const submitBtn = document.getElementById('submitBtn');
    const hintBtn = document.getElementById('hintBtn');
    const skipBtn = document.getElementById('skipBtn');
    const commandInput = document.getElementById('commandInput');

    if (startBtn) {
        startBtn.addEventListener('click', startGame);
    }

    if (submitBtn) {
        submitBtn.addEventListener('click', checkAnswer);
    }

    if (hintBtn) {
        hintBtn.addEventListener('click', showHint);
    }

    if (skipBtn) {
        skipBtn.addEventListener('click', skipCurrentChallenge);
    }

    if (commandInput) {
        commandInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && gameState.gameActive && !submitBtn.disabled) {
                checkAnswer();
            }
        });
    }
}

// =====================================================
// HELPER FUNCTIONS
// =====================================================

/**
 * Format challenge object for display
 * @param {Object} challenge - Challenge object
 * @returns {String} Formatted challenge string
 */
function formatChallenge(challenge) {
    return `
        Challenge #${challenge.id}
        Difficulty: ${challenge.difficulty}
        Category: ${challenge.category}
        Question: ${challenge.question}
    `;
}

/**
 * Export game state for persistence
 * @returns {String} JSON string of game state
 */
function exportGameState() {
    return JSON.stringify(gameState);
}

/**
 * Import game state
 * @param {String} jsonState - JSON string of game state
 */
function importGameState(jsonState) {
    try {
        const importedState = JSON.parse(jsonState);
        Object.assign(gameState, importedState);
        updateUI();
    } catch (error) {
        console.error('Failed to import game state:', error);
    }
}

/**
 * Save game to local storage
 */
function saveGameToLocalStorage() {
    try {
        localStorage.setItem('devopsCommandBattleState', exportGameState());
        console.log('Game saved to local storage');
    } catch (error) {
        console.error('Failed to save game:', error);
    }
}

/**
 * Load game from local storage
 */
function loadGameFromLocalStorage() {
    try {
        const savedState = localStorage.getItem('devopsCommandBattleState');
        if (savedState) {
            importGameState(savedState);
            console.log('Game loaded from local storage');
            return true;
        }
    } catch (error) {
        console.error('Failed to load game:', error);
    }
    return false;
}

// =====================================================
// INITIALIZE ON DOCUMENT READY
// =====================================================

document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    updateUI();
    
    // Try to load saved game
    if (loadGameFromLocalStorage()) {
        console.log('Previous game state restored');
    }
});

// Auto-save game state every 30 seconds
setInterval(() => {
    if (gameState.gameActive) {
        saveGameToLocalStorage();
    }
}, 30000);
