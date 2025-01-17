<template>
  <h1>Hi, this is the profile of {{ nickname }}</h1>

  <div>
    <button class="score-button" @click="showScores" v-if="!ScoresVisible">
      Show Top 3 Scores
    </button>

    <div v-if="ScoresVisible" class="scores-container">
      <ul v-if="scores.length" class="score-list">
        <li v-for="(score, index) in scores" :key="index" class="score-item">
          Score: <span>{{ score }}ms</span>
        </li>
      </ul>
      <p v-else class="no-scores"> No scores available. </p>

      <button class="score-button" @click="HideScores"> Hide Scores </button>
    </div>
    <div class="achievements-container">
      <button class="achievement-button" @click="ShowAchievements">Show Achievements</button>
    </div>
    
  </div>
</template>

<script>
  export default {
    data() {
      return {
        scores: [],
        ScoresVisible: false,
        nickname: '', // Will hold the nickname
      };
    },
    mounted() {
      this.nickname = this.$route.params.nickname; // Initialize nickname on mount
      console.log(this.nickname);
    },
    watch: {
      '$route.params.nickname'(newNickname) {
        this.nickname = newNickname; 
        console.log('Route param changed:', newNickname);
      }
    },
    methods: {
      HideScores() {
        this.ScoresVisible = false;
      },

      ShowAchievements(){
        this.$router.push({ name: 'Achievements', params: {nickname: this.search}});
      },

      async showScores() {
        this.ScoresVisible = true;

        console.log("Show Scores button clicked");
        console.log(this.nickname);

        try {
          const response = await fetch("http://localhost:8080/users/userscore", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              nickname: this.nickname,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            console.log("scores Success:", data);

            this.scores = data.scores.map((scoreObj) => scoreObj.score);

            console.log(this.scores);
          } else {
            const data = await response.json();
            console.error("request Failed:", data);
          }
        } catch (error) {
          console.error("Request failed:", error);
          alert("An error occurred. Please try again later.");
        }
      },
    },
  };
</script>
  
  <style>
  h1 {
    font-size: 2.5rem;
    margin-bottom: 20px;
    text-shadow: 2px 4px 6px rgba(0, 0, 0, 0.3);
    color: white;
  }
  
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

  .achievement-button {
    padding: 14px 24px;
    font-size: 1.2rem;
    background-color: #9333EA;;
    color: white;
    border: none;
    border-radius: 30px;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
    transition: all 0.3s ease-in-out;
    font-weight: 500;
    text-transform: uppercase;
  }

  .achievement-button:hover {
    background: #6b21a8;
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
  
  .score-button:hover {
    background-color: #3730a3;
    transform: translateY(-3px) scale(1.05);
  }
  
  .scores-container, .achievements-container {
    margin-top: 20px;
    text-align: center;
    animation: fadeIn 0.5s ease-in-out;
  }
  
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
  
  .no-scores {
    font-size: 1.2rem;
    font-weight: 500;
    color: #6b7280;
  }
  
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
  