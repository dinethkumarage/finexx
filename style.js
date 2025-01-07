// DOM Elements
const goalInput = document.getElementById('goalAmount');
const setInput = document.getElementById('setAmount');
const totalCirclesEl = document.getElementById('totalCircles');
const moneyMadeEl = document.getElementById('moneyMade');
const moneyLeftEl = document.getElementById('moneyLeft');
const circlesGrid = document.getElementById('circlesGrid');
const generateBtn = document.getElementById('generateBtn');
const resetBtn = document.getElementById('resetBtn');

// State object
let state = {
    goalAmount: 0,
    setAmount: 0,
    completedCircles: [],
    isGenerated: false
};

// Load saved state from localStorage
function loadState() {
    const saved = localStorage.getItem('moneyTrackerState');
    if (saved) {
        state = JSON.parse(saved);
        goalInput.value = state.goalAmount;
        setInput.value = state.setAmount;
        if (state.isGenerated) {
            updateDisplay();
        }
    }
}

// Save state to localStorage
function saveState() {
    localStorage.setItem('moneyTrackerState', JSON.stringify(state));
}

// Format number as currency
function formatMoney(amount) {
    return '$' + amount.toLocaleString();
}

// Generate circles
function generateGoals() {
    if (!state.goalAmount || !state.setAmount) {
        alert('Please enter both the goal amount and amount per circle');
        return;
    }
    state.isGenerated = true;
    state.completedCircles = [];
    saveState();
    updateDisplay();
}

// Update all display elements
function updateDisplay() {
    if (!state.goalAmount || !state.setAmount) {
        totalCirclesEl.textContent = '0';
        moneyMadeEl.textContent = '$0';
        moneyLeftEl.textContent = '$0';
        circlesGrid.innerHTML = '';
        return;
    }

    // Calculate total circles needed
    const totalCircles = Math.ceil(state.goalAmount / state.setAmount);
    totalCirclesEl.textContent = totalCircles;

    // Calculate money made and left
    const moneyMade = state.completedCircles.length * state.setAmount;
    const moneyLeft = state.goalAmount - moneyMade;

    moneyMadeEl.textContent = formatMoney(moneyMade);
    moneyLeftEl.textContent = formatMoney(moneyLeft);

    // Update circles grid
    if (state.isGenerated) {
        circlesGrid.innerHTML = '';
        for (let i = 0; i < totalCircles; i++) {
            const circle = document.createElement('div');
            circle.className = 'circle' + (state.completedCircles.includes(i) ? ' active' : '');
            circle.dataset.index = i;
            circlesGrid.appendChild(circle);
        }
    } else {
        circlesGrid.innerHTML = '';
    }
}

// Handle circle click
function handleCircleClick(e) {
    if (!e.target.classList.contains('circle')) return;
    if (!state.isGenerated) return;

    const index = parseInt(e.target.dataset.index);
    const circleIndex = state.completedCircles.indexOf(index);

    if (circleIndex === -1) {
        state.completedCircles.push(index);
    } else {
        state.completedCircles.splice(circleIndex, 1);
    }

    saveState();
    updateDisplay();
}

// Reset everything
function resetTracker() {
    state = {
        goalAmount: 0,
        setAmount: 0,
        completedCircles: [],
        isGenerated: false
    };
    goalInput.value = '';
    setInput.value = '';
    localStorage.removeItem('moneyTrackerState');
    updateDisplay();
}

// Event Listeners
goalInput.addEventListener('input', (e) => {
    state.goalAmount = Number(e.target.value);
    state.isGenerated = false;
    saveState();
    updateDisplay();
});

setInput.addEventListener('input', (e) => {
    state.setAmount = Number(e.target.value);
    state.isGenerated = false;
    saveState();
    updateDisplay();
});

generateBtn.addEventListener('click', generateGoals);
circlesGrid.addEventListener('click', handleCircleClick);
resetBtn.addEventListener('click', resetTracker);

// Initialize
loadState();