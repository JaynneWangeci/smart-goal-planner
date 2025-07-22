/ src/components/DepositForm.jsx
import React, { useState, useEffect } from "react";

const DepositForm = ({ goal, onDeposit, onClose }) => {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  
  useEffect(() => {
    const inputField = document.getElementById("deposit-amount");
    if (inputField) inputField.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const depositAmount = parseFloat(amount);

    
    if (isNaN(depositAmount) || depositAmount <= 0) {
      setError("Please enter a valid positive amount");
      return;
    }

    
    setError("");
    setSuccess(true);

    
    setTimeout(() => {
      onDeposit(goal.id, depositAmount);
      setAmount("");
      onClose();
    }, 800);
  };

  const remaining = goal.targetAmount - goal.savedAmount;
  const percentComplete = Math.min((goal.savedAmount / goal.targetAmount) * 100, 100).toFixed(1);

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2 style={styles.title}>Make a Deposit</h2>
      
      <div style={styles.goalInfo}>
        <h3 style={styles.goalName}>{goal.name}</h3>
        <p style={styles.goalDetails}>
          <span style={styles.label}>Current Progress:</span> 
          <span style={styles.value}>{percentComplete}%</span>
        </p>
        <p style={styles.goalDetails}>
          <span style={styles.label}>Saved:</span> 
          <span style={styles.value}>${goal.savedAmount.toLocaleString()}</span>
        </p>
        <p style={styles.goalDetails}>
          <span style={styles.label}>Target:</span> 
          <span style={styles.value}>${goal.targetAmount.toLocaleString()}</span>
        </p>
        <p style={styles.goalDetails}>
          <span style={styles.label}>Remaining:</span> 
          <span style={styles.value}>${remaining.toLocaleString()}</span>
        </p>
      </div>
      
      <div style={styles.inputGroup}>
        <label htmlFor="deposit-amount" style={styles.label}>Deposit Amount:</label>
        <div style={styles.inputWrapper}>
          <span style={styles.currencySymbol}>$</span>
          <input
            id="deposit-amount"
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setError("");
            }}
            style={styles.input}
            required
            step="0.01"
            min="0.01"
          />
        </div>
      </div>
      
      {error && <p style={styles.error}>{error}</p>}
      {success && <p style={styles.success}>Deposit successful!</p>}

      <div style={styles.buttonGroup}>
        <button type="button" onClick={onClose} style={styles.cancelBtn}>Cancel</button>
        <button type="submit" style={styles.submitBtn}>Make Deposit</button>
      </div>
    </form>
  );
};

const styles = {
  form: {
    width: "100%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)"
  },
  title: {
    textAlign: "center",
    color: "#3498db",
    marginTop: 0,
    marginBottom: 20,
    borderBottom: "2px solid #f0f0f0",
    paddingBottom: 10
  },
  goalInfo: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20
  },
  goalName: {
    margin: "0 0 10px 0",
    color: "#2c3e50",
    fontSize: 18
  },
  goalDetails: {
    margin: "8px 0",
    display: "flex",
    justifyContent: "space-between"
  },
  label: {
    fontWeight: "bold",
    color: "#7f8c8d"
  },
  value: {
    color: "#2c3e50"
  },
  inputGroup: {
    marginBottom: 15
  },
  inputWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center"
  },
  currencySymbol: {
    position: "absolute",
    left: 10,
    fontSize: 16,
    color: "#7f8c8d"
  },
  input: {
    width: "100%",
    padding: "10px 10px 10px 25px",
    fontSize: 16,
    border: "1px solid #ddd",
    borderRadius: 4,
    boxSizing: "border-box"
  },
  error: {
    color: "#e74c3c",
    margin: "5px 0",
    fontSize: 14
  },
  success: {
    color: "#2ecc71",
    margin: "5px 0",
    fontSize: 14
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 20
  },
  cancelBtn: {
    backgroundColor: "#95a5a6",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: 4,
    cursor: "pointer",
    flex: 1,
    marginRight: 10
  },
  submitBtn: {
    backgroundColor: "#2ecc71",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: 4,
    cursor: "pointer",
    flex: 1,
    marginLeft: 10
  }
};

export default DepositForm;

