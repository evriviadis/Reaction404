<template>
    <div class="leaderboard">
      <h1>Leaderboard</h1>
      <table>
        <thead>
          <tr>
            <th>Position</th>
            <th>Nickname</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(player, index) in players" :key="player.nickname">
            <td class="position-cell">{{ index + 1 }}</td>
            <td class="nickname-cell">{{ player.nickname }}</td>
            <td class="score-cell">{{ player.highest_score }}ms</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  export default {
    name: "LeaderBoard",
    data() {
      return {
        players: [], // This will hold the leaderboard data
      };
    },
    async mounted() {
        try {
          const response = await fetch("http://localhost:8080/users/leaderboard", {
            method: "GET",
            headers: {
              "Content-Type": "application/json"
            }
          });
  
          if (response.ok) {
            const data = await response.json();
            console.log("top 10 scores Success:", data);

            this.players = data.scores.map(scoreObj => scoreObj);

          } else {
            const data = await response.json();
            console.error("request Failed:", data);
          }
        } catch (error) {
          console.error("Request failed:", error);
          console.log(error);
          alert("An error occurred. Please try again later.");
        }
    },
  };
  </script>
  
  <style>
  .leaderboard {
    font-family: "Poppins", sans-serif;
    text-align: center;
    padding: 20px;
    color: white;
    min-height: 100vh;
    margin-top: 300px;
  }
  
  h1 {
    font-size: 2.5rem;
    margin-bottom: 20px;
  }
  
  table {
    width: 80%;
    margin: 0 auto;
    border-collapse: collapse;
    background: #4f46e5; 
    color: #333;
    border-radius: 12px;
    overflow: hidden;
  }

td {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 12px; 
}

thead th {
  background-color: #4f46e5;
  color: white;
  box-shadow: none;
}

th {
  padding: 15px;
  text-align: left;
}
  
tr:hover {
  background-color: #0a48c6;
} 

.nickname-cell {
  font-weight: bold;
  color: #ffffff;
  padding: 12px;
  text-align: center;
}

.score-cell {
  font-size: 1.2rem;
  color: #ffffff; 
  padding: 12px;
  text-align: center;
}

.position-cell {
  font-size: 1.2rem;
  font-weight: bold;
  color: #ffffff; 
  padding: 12px;
  text-align: center;
}
</style>
  