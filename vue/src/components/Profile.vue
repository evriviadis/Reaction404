<template>
    <h1>Hi, this is the profile</h1>
  
    <div>
      <button class="score-button" @click="showScores" v-if="!ScoresVisible"> Show My Scores </button>
  
      <div v-if="ScoresVisible" class="scores-container">
        <ul v-if="scores.length" class="score-list">
          <li v-for="(score, index) in scores" :key="index" class="score-item">
            Score: <span>{{ score }}</span>
          </li>
        </ul>
        <p v-else class="no-scores">No scores available.</p>
  
        <button class="score-button" @click="HideScores"> Hide Scores </button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        scores: [],
        ScoresVisible: false
      };
    },
    methods: {
      HideScores() {
        this.ScoresVisible = false;
      },
      async showScores() {
        this.ScoresVisible = true;
  
        console.log("Show Scores button clicked");
        try {
          const response = await fetch("http://localhost:8080/users/userscore", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              username: this.$root.username
            })
          });
  
          if (response.ok) {
            const data = await response.json();
            console.log("scores Success:", data);
  
            this.scores = data.scores.map(scoreObj => scoreObj.score);
  
            console.log(this.scores);
          } else {
            const data = await response.json();
            console.error("request Failed:", data);
          }
        } catch (error) {
          console.error("Request failed:", error);
          console.log(error);
          alert("An error occurred. Please try again later.");
        }
      }
    }
  };
  </script>
  
  <style>
  /* Profile Page Styles */
  
  /* Heading Style */
  h1 {
    font-size: 2.5rem;
    margin-bottom: 20px;
    text-shadow: 2px 4px 6px rgba(0, 0, 0, 0.3);
    color: white;
  }
  
  /* Button Style */
  .score-button {
    padding: 14px 24px;
    font-size: 1.2rem;
    background-color: #4f46e5;
    color: white;
    border: none;
    border-radius: 30px;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
    transition: all 0.3s ease-in-out;
    font-weight: 500;
    text-transform: uppercase;
  }
  
  .score-button:hover {
    background-color: #3730a3;
    transform: translateY(-3px) scale(1.05);
  }
  
  .score-button:active {
    background-color: #2c267a;
    transform: translateY(1px);
  }
  
  /* Scores Container */
  .scores-container {
    margin-top: 20px;
    text-align: center;
    animation: fadeIn 0.5s ease-in-out;
  }
  
  /* Score List */
  .score-list {
    list-style-type: none;
    padding: 0;
    margin-bottom: 20px;
  }
  
  .score-item {
    font-size: 1.5rem;
    font-weight: bold;
    color: #4f46e5;
    background-color: #e5e7eb;
    border-radius: 10px;
    padding: 10px 20px;
    margin: 10px auto;
    width: fit-content;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    transition: transform 0.3s ease, background-color 0.3s ease;
  }
  
  .score-item span {
    color: #0f172a;
    font-weight: 700;
  }
  
  .score-item:hover {
    transform: translateY(-3px) scale(1.05);
    background-color: #d1d5db;
  }
  
  /* No Scores Text */
  .no-scores {
    font-size: 1.2rem;
    font-weight: 500;
    color: #6b7280;
  }
  
  /* Animations */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  /* Responsive Design */
  @media (max-width: 768px) {
    h1 {
      font-size: 2rem;
    }
  
    .score-button {
      font-size: 1rem;
      padding: 12px 20px;
    }
  
    .score-item {
      font-size: 1.2rem;
      padding: 8px 16px;
    }
  }
  </style>
  