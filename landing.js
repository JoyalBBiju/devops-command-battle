// =====================================================
// DevOps Command Battle - Landing Page & Difficulty
// =====================================================

/**
 * Global difficulty setting
 */
let selectedDifficulty = 'Beginner';

/**
 * Difficulty configuration
 */
const difficultyConfig = {
    Beginner: {
        name: 'Beginner',
        icon: '🌱',
        description: 'Perfect for newcomers',
        multiplier: 1.0,
        maxQuestions: 5,
        categoryFilter: ['File Navigation', 'File Operations'],
        scoreMultiplier: 1.0,
        questionsPerSession: 10
    },
    Intermediate: {
        name: 'Intermediate',
        icon: '📚',
        description: 'For experienced users',
        multiplier: 1.5,
        maxQuestions: 8,
        categoryFilter: ['File Navigation', 'File Operations', 'Search & Find'],
        scoreMultiplier: 1.5,
        questionsPerSession: 15
    },
    Advanced: {
        name: 'Advanced',
        icon: '🔧',
        description: 'Challenge yourself',
        multiplier: 2.0,
        maxQuestions: 10,
        categoryFilter: ['Search & Find', 'Text Processing', 'Compression', 'System Information'],
        scoreMultiplier: 2.0,
        questionsPerSession: 20
    },
    Expert: {
        name: 'Expert',
        icon: '⚙️',
        description: 'For the elite',
        multiplier: 2.5,
        maxQuestions: 15,
        categoryFilter: ['Permissions & Ownership', 'Piping & Redirection', 'Package Management', 'Services & Processes'],
        scoreMultiplier: 2.5,
        questionsPerSession: 25
    },
    Master: {
        name: 'Master',
        icon: '👑',
        description: 'Ultimate challenge',
        multiplier: 3.0,
        maxQuestions: 20,
        categoryFilter: ['Advanced Scripting', 'Docker', 'Git'],
        scoreMultiplier: 3.0,
        questionsPerSession: 30
    }
};

/**
 * Select difficulty and start game
 * @param {String} difficulty - Selected difficulty level
 */
function selectDifficulty(difficulty) {
    selectedDifficulty = difficulty;
    const config = difficultyConfig[difficulty];

    // Verify difficulty is valid
    if (!config) {
        console.error('Invalid difficulty:', difficulty);
        return;
    }

    // Update game state
    gameState.selectedDifficulty = difficulty;
    gameState.difficultyMultiplier = config.scoreMultiplier;
    gameState.questionsPerSession = config.questionsPerSession;

    // Log selection
    console.log(`Difficulty selected: ${difficulty}`);
    console.log(`Multiplier: ${config.scoreMultiplier}x`);
    console.log(`Questions this session: ${config.questionsPerSession}`);

    // Transition to game page
    transitionToGame();
}

/**
 * Transition from landing page to game page
 */
function transitionToGame() {
    const landingPage = document.getElementById('landingPage');
    const gamePage = document.getElementById('gamePage');

    if (landingPage && gamePage) {
        landingPage.classList.add('hidden');
        gamePage.classList.add('active');
    }

    // Update difficulty display
    const difficultyDisplay = document.getElementById('currentDifficulty');
    if (difficultyDisplay) {
        difficultyDisplay.textContent = selectedDifficulty;
    }

    // Start game
    setTimeout(() => {
        startGame();
    }, 300);
}

/**
 * Transition back to landing page
 */
function transitionToLanding() {
    const landingPage = document.getElementById('landingPage');
    const gamePage = document.getElementById('gamePage');

    if (landingPage && gamePage) {
        gamePage.classList.remove('active');
        landingPage.classList.remove('hidden');
    }

    // Reset game
    resetGame();
}

/**
 * Get challenges based on selected difficulty
 * @returns {Array} Filtered challenges
 */
function getChallengesForDifficulty() {
    const config = difficultyConfig[selectedDifficulty];
    if (!config) return getAllChallenges();

    const challenges = getAllChallenges();
    return challenges.filter(challenge => 
        config.categoryFilter.includes(challenge.category)
    );
}

/**
 * Get random challenge for selected difficulty
 * @returns {Object} Random challenge
 */
function getRandomChallengeForDifficulty() {
    const challenges = getChallengesForDifficulty();
    
    if (challenges.length === 0) {
        // Fallback to random challenge if no matches found
        console.warn('No challenges found for difficulty, using random');
        return getRandomChallenge();
    }

    return challenges[Math.floor(Math.random() * challenges.length)];
}

/**
 * Enhanced loadNextChallenge to use difficulty filtering
 */
function loadNextChallengeForDifficulty() {
    // Clear UI
    const commandInput = document.getElementById('commandInput');
    const feedback = document.getElementById('feedback');
    const hintElement = document.getElementById('hint');

    commandInput.value = '';
    feedback.classList.remove('show', 'success', 'error', 'warning');
    hintElement.classList.remove('show');
    if (hintElement) hintElement.style.display = 'none';

    // Get challenge for selected difficulty
    gameState.currentChallenge = getRandomChallengeForDifficulty();

    // Update level
    updateLevel();

    // Display challenge
    displayChallenge();

    // Enable controls
    enableGameControls();
    
    // Focus input
    commandInput.focus();
}

/**
 * Apply difficulty multiplier to score
 * @param {Number} baseScore - Base score
 * @returns {Number} Multiplied score
 */
function applyDifficultyMultiplier(baseScore) {
    const multiplier = difficultyConfig[selectedDifficulty].scoreMultiplier;
    return Math.floor(baseScore * multiplier);
}

/**
 * Get difficulty badge HTML
 * @returns {String} HTML badge
 */
function getDifficultyBadgeHTML() {
    const config = difficultyConfig[selectedDifficulty];
    return `
        <div class="difficulty-level ${selectedDifficulty.toLowerCase()}">
            ${config.icon} ${selectedDifficulty} | 
            Multiplier: x${config.scoreMultiplier}
        </div>
    `;
}

/**
 * Display difficulty information
 */
function displayDifficultyInfo() {
    const config = difficultyConfig[selectedDifficulty];
    console.log(`
        ╔════════════════════════════════════╗
        ║  DIFFICULTY: ${config.name.padEnd(24)}║
        ║  Description: ${config.description.padEnd(19)}║
        ║  Score Multiplier: ${config.scoreMultiplier}x${' '.repeat(11)}║
        ║  Max Questions: ${config.maxQuestions}${' '.repeat(16)}║
        ║  Session Questions: ${config.questionsPerSession}${' '.repeat(9)}║
        ╚════════════════════════════════════╝
    `);
}

/**
 * Get difficulty statistics
 * @returns {Object} Difficulty stats
 */
function getDifficultyStats() {
    const config = difficultyConfig[selectedDifficulty];
    const challenges = getChallengesForDifficulty();

    return {
        difficulty: selectedDifficulty,
        config: config,
        availableChallenges: challenges.length,
        estimatedTime: Math.round(config.questionsPerSession * 1.5) + ' minutes',
        expectedScore: config.questionsPerSession * 10 * config.scoreMultiplier
    };
}

/**
 * Initialize back button
 */
function initializeBackButton() {
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            const confirmBack = confirm('Are you sure you want to go back to the menu? Your progress will be lost.');
            if (confirmBack) {
                transitionToLanding();
            }
        });
    }
}

/**
 * Override loadNextChallenge for difficulty filtering
 * This replaces the original function when game starts
 */
function setupDifficultyFiltering() {
    // Store original function
    const originalLoadNextChallenge = window.loadNextChallenge;

    // Override with difficulty-aware version
    window.loadNextChallenge = function() {
        // Clear UI
        const commandInput = document.getElementById('commandInput');
        const feedback = document.getElementById('feedback');
        const hintElement = document.getElementById('hint');

        commandInput.value = '';
        feedback.classList.remove('show', 'success', 'error', 'warning');
        hintElement.classList.remove('show');
        if (hintElement) hintElement.style.display = 'none';

        // Get challenge for selected difficulty
        gameState.currentChallenge = getRandomChallengeForDifficulty();

        // Update level
        updateLevel();

        // Display challenge
        displayChallenge();

        // Enable controls
        enableGameControls();
        
        // Focus input
        commandInput.focus();
    };
}

/**
 * Override handleCorrectAnswer to apply difficulty multiplier
 */
function setupDifficultyScoring() {
    const originalHandleCorrectAnswer = window.handleCorrectAnswerEnhanced;

    window.handleCorrectAnswerEnhanced = function() {
        const timeSpent = calculateTimeSinceChallenge();
        const scoreBreakdown = calculateDetailedScore(gameState.currentChallenge, timeSpent);
        
        // Apply difficulty multiplier
        const difficultyMultiplier = difficultyConfig[selectedDifficulty].scoreMultiplier;
        scoreBreakdown.finalScore = Math.floor(scoreBreakdown.finalScore * difficultyMultiplier);
        
        gameState.score += scoreBreakdown.finalScore;
        gameState.streak++;
        gameState.correctAnswers++;

        // Check for achievements
        const achievementBonus = checkAchievements();
        gameState.score += achievementBonus;

        // Update max streak
        if (gameState.streak > gameState.maxStreak) {
            gameState.maxStreak = gameState.streak;
        }

        // Update category stats
        if (gameState.currentChallenge.category) {
            if (!gameState.categoryStats[gameState.currentChallenge.category]) {
                gameState.categoryStats[gameState.currentChallenge.category] = {
                    correct: 0,
                    total: 0,
                    totalScore: 0
                };
            }
            gameState.categoryStats[gameState.currentChallenge.category].correct++;
            gameState.categoryStats[gameState.currentChallenge.category].total++;
            gameState.categoryStats[gameState.currentChallenge.category].totalScore += scoreBreakdown.finalScore;
        }

        // Build detailed feedback message
        let feedbackMessage = `✓ Correct! +${scoreBreakdown.finalScore} points (x${difficultyMultiplier} multiplier)\n`;
        feedbackMessage += `├─ Base: ${scoreBreakdown.baseScore}\n`;
        feedbackMessage += `├─ Level: +${scoreBreakdown.levelBonus}\n`;
        feedbackMessage += `├─ Streak: +${scoreBreakdown.streakBonus}\n`;
        
        if (scoreBreakdown.speedBonus > 0) {
            feedbackMessage += `├─ Speed: +${scoreBreakdown.speedBonus}\n`;
        }
        
        feedbackMessage += `└─ Difficulty x${scoreBreakdown.difficultyMultiplier}`;

        showFeedback(feedbackMessage, 'success');

        // Check for level up
        checkLevelUp();

        disableGameControls();
        updateNextButton();
    };
}

/**
 * Enhanced game initialization with difficulty support
 */
function initializeGameWithDifficulty() {
    setupDifficultyFiltering();
    setupDifficultyScoring();
    initializeBackButton();
}

// =====================================================
// INITIALIZATION
// =====================================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize difficulty system
    console.log('Initializing DevOps Command Battle with Difficulty System');
    
    // Add click handlers to difficulty cards
    const difficultyCards = document.querySelectorAll('.difficulty-card');
    difficultyCards.forEach(card => {
        card.addEventListener('click', function() {
            // Visual feedback
            difficultyCards.forEach(c => c.style.opacity = '0.6');
            this.style.opacity = '1';
        });
    });

    // Initialize game with difficulty support when game starts
    const originalStartGame = window.startGame;
    if (originalStartGame) {
        window.startGame = function() {
            initializeGameWithDifficulty();
            originalStartGame();
        };
    }

    // Update UI
    updateUI();
});
