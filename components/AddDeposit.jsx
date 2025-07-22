import React, { useState } from 'react';

function AddDeposit({ goals, updateGoal }) {
  const [amount, setAmount] = useState('');
  const [goalId, setGoalId] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;

    const updatedAmount = Number(goal.savedAmount) + Number(amount);
    updateGoal(goalId, { savedAmount: updatedAmount });

    setAmount('');
    setGoalId('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Deposit</h2>
      <select value={goalId} onChange={e => setGoalId(e.target.value)} required>
        <option value="">Select Goal</option>
        {goals.map(g => (
          <option key={g.id} value={g.id}>{g.name}</option>
        ))}
      </select>
      <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Deposit Amount" required />
      <button type="submit">Deposit</button>
    </form>
  );
}

export default AddDeposit;
