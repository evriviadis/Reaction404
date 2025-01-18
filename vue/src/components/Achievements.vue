  <template>
    <div class="card-container">
      <div
        v-for="achievement in achievements" :key="achievement.id" class="card-wrapper"
        :class="{ unlocked: achieved.some(item => item.achievement_id === achievement.id) }">
        <div class="card">
          <h2>{{ achievement.name }}</h2>
          <p>{{ achievement.description }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        achieved: [],
        achievements: [],
        nickname: '',
      };
    },
    watch: {
      '$route.params.nickname'(newNickname) {
        this.nickname = newNickname; 
        console.log('Route param changed:', newNickname);
      }
    },
    async mounted() {
        this.nickname = this.$route.params.nickname; 
        try {
            const response = await fetch("http://localhost:8080/users/achievements", {
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
              console.log("Cards fetched successfully:", data);

              this.achieved = [...data.achievements] 
              console.log(this.achieved);
          
              this.achievements = [...data.achievementDatabase] 
              console.log(this.achievements);

            } else {
                const errorData = await response.json();
                console.error("Failed to fetch cards:", errorData);
            }
        } catch (error) {
            console.error("An error occurred while fetching cards:", error);
        }
    },
  };
  </script>
  
  <style>

.card-container {
  display: flex;
  flex-wrap: wrap; 
  gap: 20px; 
  justify-content: center; 
  align-items: flex-start; 
  padding: 20px;
}

.card-wrapper {
  flex: 1 1 300px; 
  max-width: 300px; 
  text-align: center;
}

.card {
  width: 100%; 
  height: 250px;
  background-color: rgb(203, 84, 80); 
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  clear: both; 
  margin-top: 20px;
}

.card-wrapper.unlocked .card {
  width: 100%; 
  height: 250px;
  background-color: #5ce85c; 
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  clear: both;
  margin-top: 20px;
}

.card:hover {
  transform: translateY(-10px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.card h2 {
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: #1f2937;
}

.card p {
  font-size: 1rem;
  color: #4b5563;
}
  </style>
  