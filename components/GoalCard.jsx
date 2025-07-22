// src/components/GoalCard.jsx
import React from "react";

const GoalCard = ({ goal, onDelete, onDeposit }) => {
  const { id, name, targetAmount, savedAmount, category, deadline, createdAt } = goal;
  const progress = Math.min((savedAmount / targetAmount) * 100, 100).toFixed(1);
  const remaining = targetAmount - savedAmount;

  // Calculate days remaining until deadline
  const today = new Date();
  const deadlineDate = new Date(deadline);
  const daysRemaining = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));

  // Determine status and color
  let statusText = "";
  let statusColor = "";
  let progressBarColor = "#4caf50"; // Default green

  if (savedAmount >= targetAmount) {
    statusText = ":white_check_mark: Goal Achieved!";
    statusColor = "#2ecc71";
  } else if (daysRemaining < 0) {
    statusText = ":x: Deadline Passed";
    statusColor = "#e74c3c";
    progressBarColor = "#e74c3c";
  } else if (daysRemaining <= 30) {
    statusText = `⚠️ ${daysRemaining} days left`;
    statusColor = "#f39c12";
    progressBarColor = "#f39c12";
  } else {
    statusText = `${daysRemaining} days remaining`;
    statusColor = "#3498db";
  }

  // Format dates for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div style={styles.card}>
      <div style={styles.categoryBadge}>{category || "Uncategorized"}</div>
      
      <h2 style={styles.title}>{name}</h2>
      
      <div style={styles.progressContainer}>
        <div 
          style={{ 
            ...styles.progressBar, 
            width: `${progress}%`,
            backgroundColor: progressBarColor
          }}
        >
          {progress}%
        </div>
      </div>
      
      <div style={styles.infoGrid}>
        <div style={styles.infoItem}>
          <span style={styles.infoLabel}>Target</span>
          <span style={styles.infoValue}>${targetAmount.toLocaleString()}</span>
        </div>
        
        <div style={styles.infoItem}>
          <span style={styles.infoLabel}>Saved</span>
          <span style={styles.infoValue}>${savedAmount.toLocaleString()}</span>
        </div>
        
        <div style={styles.infoItem}>
          <span style={styles.infoLabel}>Remaining</span>
          <span style={styles.infoValue}>${remaining.toLocaleString()}</span>
        </div>
        
        <div style={styles.infoItem}>
          <span style={styles.infoLabel}>Deadline</span>
          <span style={styles.infoValue}>{formatDate(deadline)}</span>
        </div>
      </div>
      
      <div style={{...styles.statusBar, color: statusColor}}>
        {statusText}
      </div>
      
      <div style={styles.buttonGroup}>
        <button 
          onClick={() => onDeposit(goal)} 
          style={styles.depositBtn}
        >
          Add Deposit
        </button>
        <button 
          onClick={() => onDelete(id)} 
          style={styles.deleteBtn}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

const styles = {
  card: {
    position: "relative",
    border: "1px solid #e0e0e0",
    borderRadius: 12,
    padding: 20,
    backgroundColor: "#ffffff",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
    transition: "transform 0.2s, box-shadow 0.2s",
    overflow: "hidden"
  },
  categoryBadge: {
    position: "absolute",
    top: 15,
    right: 15,
    backgroundColor: "#3498db",
    color: "white",
    padding: "4px 10px",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: "bold"
  },
  title: {
    marginTop: 10,
    marginBottom: 20,
    color: "#2c3e50",
    fontSize: 22,
    paddingRight: 80 // Make room for the category badge
  },
  progressContainer: {
    width: "100%",
    height: 24,
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    margin: "15px 0",
    overflow: "hidden"
  },
  progressBar: {
    height: "100%",
    textAlign: "center",
    lineHeight: "24px",
    color: "white",
    fontWeight: "bold",
    transition: "width 0.5s ease-in-out"
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
    marginBottom: 15
  },
  infoItem: {
    display: "flex",
    flexDirection: "column"
  },
  infoLabel: {
    fontSize: 12,
    color: "#7f8c8d",
    marginBottom: 2
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2c3e50"
  },
  statusBar: {
    textAlign: "center",
    padding: "8px 0",
    fontWeight: "bold",
    marginBottom: 15,
    borderRadius: 4
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "space-between",
    gap: 10
  },
  depositBtn: {
    flex: 1,
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    padding: "10px",
    borderRadius: 6,
    cursor: "pointer",
    fontWeight: "bold",
    transition: "background-color 0.2s"
  },
  deleteBtn: {
    flex: 1,
    backgroundColor: "#e74c3c",
    color: "white",
    border: "none",
    padding: "10px",
    borderRadius: 6,
    cursor: "pointer",
    fontWeight: "bold",
    transition: "background-color 0.2s"
  }
};

export default GoalCard;