import React from 'react';

function Overview({ goals }) {
  const now = new Date();
  const totalGoals = goals.length;
  const totalSaved = goals.reduce((sum, g) => sum + g.savedAmount, 0);
  const completed = goals.filter(g => g.savedAmount >= g.targetAmount).length;

  return (
    <div>
      <h2>Overview</h2>
      <p>Total Goals: {totalGoals}</p>
      <p>Total Saved: ${totalSaved}</p>
      <p>Goals Completed: {completed}</p>
      <ul>
        {goals.map(goal => {
          const deadline = new Date(goal.deadline);
          const timeLeft = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
          const isOverdue = deadline < now && goal.savedAmount < goal.targetAmount;
          const isWarning = timeLeft <= 30 && !isOverdue && goal.savedAmount < goal.targetAmount;

          return (
            <li key={goal.id}>
              {goal.name} - {timeLeft} days left
              {isWarning && <span style={{ color: 'orange' }}> ⚠️ Deadline Soon</span>}
              {isOverdue && <span style={{ color: 'red' }}> ❌ Overdue</span>}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Overview;
