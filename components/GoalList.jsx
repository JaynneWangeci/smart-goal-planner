import React from 'react';

function GoalList({ goals, updateGoal, deleteGoal }) {
  return (
    <div>
      <h2>Goals</h2>
      {goals.map(goal => {
        const percentage = Math.min((goal.savedAmount / goal.targetAmount) * 100, 100).toFixed(1);
        return (
          <div key={goal.id} className="goal-card">
            <h3>{goal.name}</h3>
            <p>Category: {goal.category}</p>
            <p>Target: ${goal.targetAmount}</p>
            <p>Saved: ${goal.savedAmount}</p>
            <p>Deadline: {goal.deadline}</p>
            <div className="progress-bar">
              <div style={{ width: `${percentage}%` }}>{percentage}%</div>
            </div>
            <button onClick={() => deleteGoal(goal.id)}>Delete</button>
          </div>
        );
      })}
    </div>
  );
}

export default GoalList;
