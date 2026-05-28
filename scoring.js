// =====================================================
// DevOps Command Battle - Advanced Scoring & Levels
// =====================================================

/**
 * Advanced Scoring System
 * Handles complex scoring calculations with multipliers and bonuses
 */
const scoringSystem = {
    // Base scoring values
    basePoints: {
        correctAnswer: 10,
        streakBonus: 5,
        levelBonus: 10,
        perfectionBonus: 50,
        speedBonus: 20,
        categoryMastery: 100
    },

    // Multipliers
    multipliers: {
        streakX2: 5,      // Activate at 5 streak
        streakX3: 10,     // Activate at 10 streak
        streakX5: 20,     // Activate at 20 streak
        levelMultiplier: 1.1,
        speedFactor: 1.5
    },

    // Penalties
    penalties: {
        wrongAnswer: 0,
        hintUsed: 5,
        skipped: 0,
        timeout: 2
    },

    // Achievements
    achievements: {
        firstBlood: { points: 25, unlocked: false },
        streak5: { points: 50, unlocked: false },
        streak10: { points: 100, unlocked: false },
        streak25: { points: 250, unlocked: false },
        level5: { points: 150, unlocked: false },
        categoryMaster: { points: 200, unlocked: false },
        speedDemon: { points: 75, unlocked: false },
        perfectAccuracy: { points: 300, unlocked: false }
    }
};

/**
 * Advanced Level System
 * Defines progression through levels with requirements and rewards
 */
const levelSystem = {
    levels: [
        {
            level: 1,
            name: "Novice",
            minScore: 0,
            minStreak: 0,
            requiredCorrect: 0,
            rewards: {
                multiplier: 1.0,
                dailyBonus: 0,
                categoryBonus: 0
            },
            description: "Just starting your DevOps journey"
        },
        {
            level: 2,
            name: "Apprentice",
            minScore: 100,
            minStreak: 3,
            requiredCorrect: 5,
            rewards: {
                multiplier: 1.1,
                dailyBonus: 10,
                categoryBonus: 0
            },
            description: "Learning the basics"
        },
        {
            level: 3,
            name: "Practitioner",
            minScore: 500,
            minStreak: 5,
            requiredCorrect: 15,
            rewards: {
                multiplier: 1.2,
                dailyBonus: 25,
                categoryBonus: 5
            },
            description: "Getting comfortable with commands"
        },
        {
            level: 4,
            name: "Specialist",
            minScore: 1500,
            minStreak: 10,
            requiredCorrect: 30,
            rewards: {
                multiplier: 1.3,
                dailyBonus: 50,
                categoryBonus: 10
            },
            description: "Mastering DevOps commands"
        },
        {
            level: 5,
            name: "Expert",
            minScore: 3000,
            minStreak: 15,
            requiredCorrect: 50,
            rewards: {
                multiplier: 1.5,
                dailyBonus: 100,
                categoryBonus: 25
            },
            description: "DevOps command master"
        },
        {
            level: 6,
            name: "Grandmaster",
            minScore: 6000,
            minStreak: 25,
            requiredCorrect: 100,
            rewards: {
                multiplier: 2.0,
                dailyBonus: 250,
                categoryBonus: 50
            },
            description: "Elite DevOps warrior"
        },
        {
            level: 7,
            name: "Legendary",
            minScore: 10000,
            minStreak: 50,
            requiredCorrect: 200,
            rewards: {
                multiplier: 2.5,
                dailyBonus: 500,
                categoryBonus: 100
            },
            description: "Living legend of DevOps"
        }
    ],

    /**
     * Get current level based on score and stats
     * @returns {Object} Current level object
     */
    getCurrentLevel() {
        for (let i = this.levels.length - 1; i >= 0; i--) {
            const level = this.levels[i];
            if (gameState.score >= level.minScore &&
                gameState.correctAnswers >= level.requiredCorrect) {
                return level;
            }
        }
        return this.levels[0];
    },

    /**
     * Get next level requirements
     * @returns {Object} Next level requirements
     */
    getNextLevelRequirements() {
        const currentLevel = this.getCurrentLevel();
        const nextLevelIndex = currentLevel.level;
        
        if (nextLevelIndex >= this.levels.length) {
            return null; // Max level reached
        }

        const nextLevel = this.levels[nextLevelIndex];
        return {
            level: nextLevel.level,
            name: nextLevel.name,
            scoreNeeded: Math.max(0, nextLevel.minScore - gameState.score),
            streakNeeded: Math.max(0, nextLevel.minStreak - gameState.correctAnswers),
            correctNeeded: Math.max(0, nextLevel.requiredCorrect - gameState.correctAnswers),
            scoreProgress: gameState.score,
            scoreTotal: nextLevel.minScore,
            correctProgress: gameState.correctAnswers,
            correctTotal: nextLevel.requiredCorrect
        };
    },

    /**
     * Get level progress percentage
     * @returns {Number} Progress percentage (0-100)
     */
    getLevelProgress() {
        const current = this.getCurrentLevel();
        const next = this.levels[current.level];
        
        if (!next) return 100; // Max level
        
        const scoreRange = next.minScore - current.minScore;
        const scoreProgress = gameState.score - current.minScore;
        return Math.min(100, Math.round((scoreProgress / scoreRange) * 100));
    }
};

/**
 * Calculate score for a correct answer with all bonuses
 * @param {Object} challenge - The challenge object
 * @param {Number} timeSpent - Time spent on challenge in seconds
 * @returns {Object} Detailed score breakdown
 */
function calculateDetailedScore(challenge, timeSpent = 0) {
    const breakdown = {
        baseScore: scoringSystem.basePoints.correctAnswer,
        levelBonus: 0,
        streakBonus: 0,
        speedBonus: 0,
        difficultyMultiplier: 1.0,
        totalBonus: 0,
        finalScore: 0
    };

    // Difficulty multiplier
    const difficultyMap = {
        'beginner': 1.0,
        'intermediate': 1.5,
        'advanced': 2.0,
        'expert': 2.5,
        'master': 3.0
    };
    breakdown.difficultyMultiplier = difficultyMap[challenge.difficulty.toLowerCase()] || 1.0;

    // Level bonus
    breakdown.levelBonus = scoringSystem.basePoints.levelBonus * gameState.level;

    // Streak bonus with multipliers
    breakdown.streakBonus = gameState.streak * scoringSystem.basePoints.streakBonus;
    
    if (gameState.streak >= scoringSystem.multipliers.streakX5) {
        breakdown.streakBonus *= 5;
    } else if (gameState.streak >= scoringSystem.multipliers.streakX3) {
        breakdown.streakBonus *= 3;
    } else if (gameState.streak >= scoringSystem.multipliers.streakX2) {
        breakdown.streakBonus *= 2;
    }

    // Speed bonus (bonus for fast answers)
    if (timeSpent > 0 && timeSpent < 30) {
        breakdown.speedBonus = scoringSystem.basePoints.speedBonus;
    }

    // Calculate total with level multiplier
    const levelMultiplier = levelSystem.getCurrentLevel().rewards.multiplier;
    breakdown.totalBonus = breakdown.levelBonus + breakdown.streakBonus + breakdown.speedBonus;
    
    breakdown.finalScore = Math.floor(
        (breakdown.baseScore + breakdown.totalBonus) * 
        breakdown.difficultyMultiplier * 
        levelMultiplier
    );

    return breakdown;
}

/**
 * Award achievement and return points
 * @param {String} achievementKey - Achievement key
 * @returns {Number} Points awarded
 */
function awardAchievement(achievementKey) {
    const achievement = scoringSystem.achievements[achievementKey];
    
    if (!achievement || achievement.unlocked) {
        return 0;
    }

    achievement.unlocked = true;
    gameState.achievements = gameState.achievements || {};
    gameState.achievements[achievementKey] = {
        name: achievementKey,
        unlockedAt: new Date(),
        points: achievement.points
    };

    showFeedback(`🏆 Achievement Unlocked: ${achievementKey.replace(/([A-Z])/g, ' $1').toUpperCase()} +${achievement.points} points!`, 'success');
    
    return achievement.points;
}

/**
 * Check and award achievements
 */
function checkAchievements() {
    let bonusPoints = 0;

    // First correct answer
    if (gameState.correctAnswers === 1) {
        bonusPoints += awardAchievement('firstBlood');
    }

    // Streak achievements
    if (gameState.streak === 5 && !scoringSystem.achievements.streak5.unlocked) {
        bonusPoints += awardAchievement('streak5');
    }
    if (gameState.streak === 10 && !scoringSystem.achievements.streak10.unlocked) {
        bonusPoints += awardAchievement('streak10');
    }
    if (gameState.streak === 25 && !scoringSystem.achievements.streak25.unlocked) {
        bonusPoints += awardAchievement('streak25');
    }

    // Level achievements
    const currentLevel = levelSystem.getCurrentLevel();
    if (currentLevel.level === 5 && !scoringSystem.achievements.level5.unlocked) {
        bonusPoints += awardAchievement('level5');
    }

    // Perfect accuracy achievement
    if (gameState.totalAttempts >= 20 && calculateAccuracy() === 100 && !scoringSystem.achievements.perfectAccuracy.unlocked) {
        bonusPoints += awardAchievement('perfectAccuracy');
    }

    return bonusPoints;
}

/**
 * Enhanced handle correct answer with detailed scoring
 */
function handleCorrectAnswerEnhanced() {
    const timeSpent = calculateTimeSinceChallenge();
    const scoreBreakdown = calculateDetailedScore(gameState.currentChallenge, timeSpent);
    
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
    let feedbackMessage = `✓ Correct! +${scoreBreakdown.finalScore} points\n`;
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
}

/**
 * Check if player leveled up
 */
function checkLevelUp() {
    const oldLevel = gameState.level;
    const currentLevelObj = levelSystem.getCurrentLevel();
    gameState.level = currentLevelObj.level;

    if (gameState.level > oldLevel) {
        showFeedback(
            `🎉 LEVEL UP! You are now ${currentLevelObj.name}!\n` +
            `Multiplier: x${currentLevelObj.rewards.multiplier}`,
            'success'
        );
    }
}

/**
 * Calculate time since challenge started
 * @returns {Number} Time in seconds
 */
function calculateTimeSinceChallenge() {
    if (!gameState.challengeStartTime) {
        return 0;
    }
    return Math.floor((Date.now() - gameState.challengeStartTime) / 1000);
}

/**
 * Get comprehensive game statistics
 * @returns {Object} Complete statistics object
 */
function getDetailedStats() {
    const currentLevel = levelSystem.getCurrentLevel();
    const nextLevel = levelSystem.getNextLevelRequirements();
    
    const stats = {
        currentLevel: {
            level: currentLevel.level,
            name: currentLevel.name,
            description: currentLevel.description,
            multiplier: currentLevel.rewards.multiplier,
            progressPercentage: levelSystem.getLevelProgress()
        },
        nextLevel: nextLevel,
        scoring: {
            totalScore: gameState.score,
            totalAttempts: gameState.totalAttempts,
            correctAnswers: gameState.correctAnswers,
            accuracy: calculateAccuracy(),
            currentStreak: gameState.streak,
            maxStreak: gameState.maxStreak
        },
        categories: getAllCategoryStats(),
        achievements: gameState.achievements || {},
        playtime: calculatePlaytime(),
        averageScorePerAnswer: gameState.correctAnswers > 0 ? 
            Math.round(gameState.score / gameState.correctAnswers) : 0
    };

    return stats;
}

/**
 * Calculate total playtime
 * @returns {String} Formatted playtime
 */
function calculatePlaytime() {
    if (!gameState.startTime) {
        return '0s';
    }

    const totalSeconds = Math.floor((Date.now() - gameState.startTime) / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
        return `${minutes}m ${seconds}s`;
    } else {
        return `${seconds}s`;
    }
}

/**
 * Update UI with new level information
 */
function updateLevelUI() {
    const levelDisplay = document.getElementById('level');
    const currentLevel = levelSystem.getCurrentLevel();
    
    if (levelDisplay) {
        levelDisplay.textContent = currentLevel.level;
        levelDisplay.title = currentLevel.name + ' - ' + currentLevel.description;
    }

    // Update level progress bar if exists
    const progressBar = document.getElementById('levelProgressBar');
    if (progressBar) {
        const progress = levelSystem.getLevelProgress();
        progressBar.style.width = progress + '%';
        progressBar.textContent = progress + '%';
    }
}

/**
 * Display detailed level progression UI
 */
function displayLevelProgression() {
    const nextLevel = levelSystem.getNextLevelRequirements();
    
    if (!nextLevel) {
        console.log('Maximum level reached!');
        return;
    }

    const progressText = `
        Next Level: ${nextLevel.name} (Level ${nextLevel.level})
        Score: ${nextLevel.scoreProgress}/${nextLevel.scoreTotal}
        Correct Answers: ${nextLevel.correctProgress}/${nextLevel.correctTotal}
    `;

    console.log(progressText);
}

/**
 * Display level-up rewards
 */
function displayLevelRewards() {
    const currentLevel = levelSystem.getCurrentLevel();
    const rewards = currentLevel.rewards;

    const rewardsText = `
        🏅 LEVEL ${currentLevel.level}: ${currentLevel.name}
        ├─ Score Multiplier: x${rewards.multiplier}
        ├─ Daily Bonus: +${rewards.dailyBonus} points
        └─ Category Bonus: +${rewards.categoryBonus} points
    `;

    console.log(rewardsText);
}

/**
 * Get rank title based on level
 * @returns {String} Rank title
 */
function getRankTitle() {
    const currentLevel = levelSystem.getCurrentLevel();
    return currentLevel.name;
}

/**
 * Get next milestone
 * @returns {Object} Next milestone info
 */
function getNextMilestone() {
    const nextLevel = levelSystem.getNextLevelRequirements();
    if (!nextLevel) {
        return {
            type: 'max-level',
            message: 'You have reached the maximum level!'
        };
    }

    // Determine which requirement is closest to completion
    const scorePercent = (nextLevel.scoreProgress / nextLevel.scoreTotal) * 100;
    const correctPercent = (nextLevel.correctProgress / nextLevel.correctTotal) * 100;

    return {
        type: nextLevel.level,
        name: nextLevel.name,
        scorePercent: Math.min(100, Math.round(scorePercent)),
        correctPercent: Math.min(100, Math.round(correctPercent)),
        message: `${scorePercent.toFixed(1)}% to ${nextLevel.name}`
    };
}

/**
 * Enhanced game state with new properties
 */
function enhanceGameState() {
    if (!gameState.achievements) {
        gameState.achievements = {};
    }
    if (!gameState.startTime) {
        gameState.startTime = Date.now();
    }
    if (!gameState.challengeStartTime) {
        gameState.challengeStartTime = Date.now();
    }
}

/**
 * Start challenge timer
 */
function startChallengeTimer() {
    gameState.challengeStartTime = Date.now();
}

/**
 * Enhanced updateUI with level information
 */
function updateUIEnhanced() {
    updateUI(); // Call existing updateUI
    updateLevelUI();
    
    // Update with level name
    const currentLevel = levelSystem.getCurrentLevel();
    const levelDisplay = document.getElementById('levelName');
    if (levelDisplay) {
        levelDisplay.textContent = currentLevel.name;
    }
}

// =====================================================
// INITIALIZATION
// =====================================================

document.addEventListener('DOMContentLoaded', () => {
    enhanceGameState();
    updateUIEnhanced();
});
