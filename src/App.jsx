import React, { useState, useEffect } from "react";
import axios from "axios";
import GoalList from "./components/GoalList.jsx";
import GoalForm from "./components/GoalForm.jsx";
import AddDeposit from "./components/AddDeposit.jsx";
import Overview from "./components/Overview.jsx";
import './App.css';

const API_URL = 'http://localhost:3000/goals';

function App() {
  const [goals, setGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios.get(API_URL)
      .then(res => {
        setGoals(res.data);
        setIsLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  const addGoal = goal => {
    axios.post(API_URL, goal).then(res => setGoals([...goals, res.data]));
  };

  const updateGoal = (id, updatedGoal) => {
    axios.patch(`${API_URL}/${id}`, updatedGoal).then(res => {
      setGoals(goals.map(goal => (goal.id === id ? res.data : goal)));
    });
  };

  const deleteGoal = id => {
    axios.delete(`${API_URL}/${id}`).then(() => {
      setGoals(goals.filter(goal => goal.id !== id));
    });
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="App">
      <h1>Smart Goal Planner</h1>
      <GoalForm addGoal={addGoal} />
      <AddDeposit goals={goals} updateGoal={updateGoal} />
      <GoalList goals={goals} updateGoal={updateGoal} deleteGoal={deleteGoal} />
      <Overview goals={goals} />
    </div>
  );
}

export default App;
