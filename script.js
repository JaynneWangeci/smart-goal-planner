document.addEventListener('DOMContentLoaded', function() {

    const goalsList = document.getElementById('goals-list');
    const addGoalBtn = document.getElementById('add-goal-btn');
    const goalModal = document.getElementById('goal-modal');
    const depositModal = document.getElementById('deposit-modal');
    const closeButtons = document.querySelectorAll('.close');
    const goalForm = document.getElementById('goal-form');
    const depositForm = document.getElementById('deposit-form');
    const totalGoalsElement = document.getElementById('total-goals');
    const totalSavedElement = document.getElementById('total-saved');
    const completedGoalsElement = document.getElementById('completed-goals');

    const API_URL = 'http://localhost:3000/goals';


    fetchGoals();

    
    addGoalBtn.addEventListener('click', () => {
        goalModal.style.display = 'block';
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            goalModal.style.display = 'none';
            depositModal.style.display = 'none';
        });
    });

    window.addEventListener('click', (event) => {
        if (event.target === goalModal) {
            goalModal.style.display = 'none';
        }
        if (event.target === depositModal) {
            depositModal.style.display = 'none';
        }
    });

    goalForm.addEventListener('submit', handleAddGoal);
    depositForm.addEventListener('submit', handleDeposit);

    // Functions
    async function fetchGoals() {
        try {
            const response = await fetch(API_URL);
            const goals = await response.json();
            renderGoals(goals);
            updateOverview(goals);
        } catch (error) {
            console.error('Error fetching goals:', error);
        }
    }

    function renderGoals(goals) {
        goalsList.innerHTML = '';
        
        if (goals.length === 0) {
            goalsList.innerHTML = '<p>No goals added yet. Click "Add New Goal" to get started!</p>';
            return;
        }

        goals.forEach(goal => {
            const goalCard = createGoalCard(goal);
            goalsList.appendChild(goalCard);
        });
    }

    function createGoalCard(goal) {
        const goalCard = document.createElement('div');
        goalCard.className = 'goal-card';
        
        const progressPercentage = (goal.savedAmount / goal.targetAmount) * 100;
        const daysLeft = calculateDaysLeft(goal.deadline);
        const status = getGoalStatus(goal, daysLeft);
        
        goalCard.innerHTML = `
            ${status ? `<span class="${status.class}">${status.text}</span>` : ''}
            <h3>${goal.name}</h3>
            <div class="goal-meta">
                <span>Target: $${goal.targetAmount.toLocaleString()}</span>
                <span>${goal.category}</span>
            </div>
            <div class="goal-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${Math.min(progressPercentage, 100)}%"></div>
                </div>
                <div class="progress-details">
                    <span>Saved: $${goal.savedAmount.toLocaleString()}</span>
                    <span>${progressPercentage.toFixed(1)}%</span>
                </div>
            </div>
            <div class="goal-meta">
                <span>Deadline: ${formatDate(goal.deadline)}</span>
                <span>${daysLeft > 0 ? `${daysLeft} days left` : 'Deadline passed'}</span>
            </div>
            <div class="goal-actions">
                <button class="btn-sm btn-success deposit-btn" data-id="${goal.id}">Deposit</button>
                <button class="btn-sm btn-warning edit-btn" data-id="${goal.id}">Edit</button>
                <button class="btn-sm btn-danger delete-btn" data-id="${goal.id}">Delete</button>
            </div>
        `;
        
        // Add event listeners to buttons
        goalCard.querySelector('.deposit-btn').addEventListener('click', () => openDepositModal(goal.id));
        goalCard.querySelector('.edit-btn').addEventListener('click', () => editGoal(goal));
        goalCard.querySelector('.delete-btn').addEventListener('click', () => deleteGoal(goal.id));
        
        return goalCard;
    }

    function openDepositModal(goalId) {
        document.getElementById('deposit-goal-id').value = goalId;
        depositModal.style.display = 'block';
    }

    async function handleAddGoal(e) {
        e.preventDefault();
        
        const name = document.getElementById('goal-name').value;
        const targetAmount = parseFloat(document.getElementById('target-amount').value);
        const category = document.getElementById('category').value;
        const deadline = document.getElementById('deadline').value;
        
        const newGoal = {
            name,
            targetAmount,
            savedAmount: 0,
            category,
            deadline,
            createdAt: new Date().toISOString().split('T')[0]
        };
        
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newGoal)
            });
            
            const createdGoal = await response.json();
            fetchGoals();
            goalModal.style.display = 'none';
            goalForm.reset();
        } catch (error) {
            console.error('Error adding goal:', error);
        }
    }

    async function handleDeposit(e) {
        e.preventDefault();
        
        const goalId = document.getElementById('deposit-goal-id').value;
        const amount = parseFloat(document.getElementById('deposit-amount').value);
        
        try {

            const response = await fetch(`${API_URL}/${goalId}`);
            const goal = await response.json();
            
            const updatedGoal = {
                ...goal,
                savedAmount: goal.savedAmount + amount
            };
            
            
            await fetch(`${API_URL}/${goalId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedGoal)
            });
            
            fetchGoals();
            depositModal.style.display = 'none';
            depositForm.reset();
        } catch (error) {
            console.error('Error making deposit:', error);
        }
    }

    async function editGoal(goal) {

        document.getElementById('goal-name').value = goal.name;
        document.getElementById('target-amount').value = goal.targetAmount;
        document.getElementById('category').value = goal.category;
        document.getElementById('deadline').value = goal.deadline;
        
        
        goalForm.removeEventListener('submit', handleAddGoal);
        goalForm.addEventListener('submit', async function handleUpdate(e) {
            e.preventDefault();
            
            const updatedGoal = {
                ...goal,
                name: document.getElementById('goal-name').value,
                targetAmount: parseFloat(document.getElementById('target-amount').value),
                category: document.getElementById('category').value,
                deadline: document.getElementById('deadline').value
            };
            
            try {
                await fetch(`${API_URL}/${goal.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updatedGoal)
                });
                
                fetchGoals();
                goalModal.style.display = 'none';
                goalForm.reset();
                
                
                goalForm.removeEventListener('submit', handleUpdate);
                goalForm.addEventListener('submit', handleAddGoal);
            } catch (error) {
                console.error('Error updating goal:', error);
            }
        });
        
        goalModal.style.display = 'block';
    }

    async function deleteGoal(goalId) {
        if (confirm('Are you sure you want to delete this goal?')) {
            try {
                await fetch(`${API_URL}/${goalId}`, {
                    method: 'DELETE'
                });
                
                fetchGoals();
            } catch (error) {
                console.error('Error deleting goal:', error);
            }
        }
    }

    function updateOverview(goals) {
        totalGoalsElement.textContent = goals.length;
        
        const totalSaved = goals.reduce((sum, goal) => sum + goal.savedAmount, 0);
        totalSavedElement.textContent = `$${totalSaved.toLocaleString()}`;
        
        const completed = goals.filter(goal => goal.savedAmount >= goal.targetAmount).length;
        completedGoalsElement.textContent = completed;
    }

    // Helper functions
    function calculateDaysLeft(deadline) {
        const today = new Date();
        const deadlineDate = new Date(deadline);
        const timeDiff = deadlineDate - today;
        return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    }

    function getGoalStatus(goal, daysLeft) {
        if (goal.savedAmount >= goal.targetAmount) {
            return { class: 'completed', text: 'Completed' };
        } else if (daysLeft < 0) {
            return { class: 'overdue', text: 'Overdue' };
        } else if (daysLeft <= 30) {
            return { class: 'warning', text: 'Due Soon' };
        }
        return null;
    }

    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }
});