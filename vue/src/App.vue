<template>
  <div id="app">
    <h1 v-if="!login">Welcome to Reaction404</h1>
    <p v-if="!login">Choose an option below:</p>

    <div class="button-container" v-if="!login">
      <router-link to="/login">
        <button class="primary-button animated-button">Login</button>
      </router-link>
      <router-link to="/sign-in">
        <button class="secondary-button animated-button">Sign In</button>
      </router-link>
    </div>

    <div v-else class="dashboard">
      <!-- <h1>Welcome Back {{nickname}}!</h1>
      <p>You are now logged in.</p> -->
      <div class="top-bar">
        <router-link :to="{ name: 'Profile', params: { nickname: this.nickname }}">
          <button class="profile-button">Profile</button>
        </router-link>

        <router-link :to="{ name: 'Leaderboard' }">
          <button class="leaderboard-button">Leaderboard</button>
        </router-link>

        <router-link :to="{ name: 'Game' }">
          <button class="game-button">Go to Game</button>
        </router-link>

        <div class="search-bar-container">
          <input 
            type="text" 
            class="search-bar" 
            placeholder="Search..." 
            @keyup.enter="handleSearch" 
            v-model="search"
          />
          <button @click="handleSearch" class="search-button">Search</button>
        </div>

        <button @click="handleLogout" class="logout-button">Logout</button>
      </div>
    </div>

    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      login: false, 
      username: '',
      nickname: '',
      search: '',
    };
  },
  methods: {
    handleLogout() {
      this.login = false; // Set login state to false
      this.$router.push({ name: 'home' });
    },
    async handleSearch() {
      console.log("Search triggered");

      try {
          const response = await fetch("http://localhost:8080/users/check_nickname", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              nickname: this.search,
            }),
          });

          if (response.ok) {
            console.log("nickname found");

            this.$router.push({ name: 'Profile', params: {nickname: this.search}});
          } else {
            const data = await response.json();
            console.error("request Failed:", data);

            alert("No user with this nickanme found");
          }
        } catch (error) {
          console.error("Request failed:", error);
          alert("An error occurred. Please try again later.");
        }
    }
  },
};
</script>

<style>
/* General Reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
  animation: slideDown 1s ease-in-out;
  color: white;
}

p {
  font-size: 1.25rem;
  color: #d1d5db;
  margin-bottom: 30px;
}

html, body {
  background: linear-gradient(135deg, #6b21a8, #1e3a8a); /* Smooth gradient background */
  height: 100%; /* Ensure full height */
  margin: 0; /* Remove any default margin */
  overflow: hidden; /* Prevent scrolling */
}

#app {
  font-family: "Poppins", sans-serif;
  text-align: center;
  min-height: 100vh; /* Ensure full viewport height */
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  color: white; 
  padding: 0; 
  overflow: hidden; 
  margin-bottom: 200px;
}

/* Button Container */
.button-container {
  display: flex;
  gap: 25px;
  justify-content: center;
  flex-wrap: wrap;
  z-index: 10; /* Make sure buttons are on top */
}

button {
  margin-top: 500px;
  padding: 14px 28px;
  font-size: 1.2rem;
  border-radius: 30px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  text-transform: uppercase;
  font-weight: 600;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 1;
  margin-bottom: 1000px;
}

.primary-button {
  background-color: #4f46e5;
  color: white;
}

.primary-button:hover {
  background-color: #3730a3;
  transform: translateY(-5px) scale(1.05);
}

.secondary-button {
  background-color: #9333ea;
  color: white;
}

.secondary-button:hover {
  background-color: #6b21a8;
  transform: translateY(-5px) scale(1.05);
}

.animated-button {
  animation: buttonBounce 1.5s infinite;
}

.top-bar {
  margin-top: 50px;
  position: absolute;
  top: 20px;
  left: 20px;
  right: 20px;
  display: flex;
  justify-content: space-between;
  z-index: 10;
}

.profile-button {
  background-color: #38bdf8;
  color: white;
  border-radius: 20px;
  padding: 10px 20px;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.profile-button:hover {
  background-color: #0ea5e9;
  transform: translateY(-3px) scale(1.05);
}

.leaderboard-button {
  background-color: #f59e0b;
  color: white;
  border-radius: 20px;
  padding: 10px 20px;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.leaderboard-button:hover {
  background-color: #d97706;
  transform: translateY(-5px) scale(1.05);
}

.logout-button {
  background-color: #ef4444;
  color: white;
  border-radius: 20px;
  padding: 10px 20px;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.logout-button:hover {
  background-color: #b91c1c;
  transform: translateY(-3px) scale(1.05);
}

.game-button {
  background-color: #059669;
  color: white;
  border-radius: 20px;
  padding: 10px 20px;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500; 
}

.game-button:hover {
  background-color: #05895f;
  transform: translateY(-5px) scale(1.05);
}

@media (max-width: 768px) {
  h1 {
    font-size: 2.5rem;
  }

  p {
    font-size: 1rem;
  }

  button {
    font-size: 1rem;
    padding: 12px 24px;
  }

  .logout-button {
    font-size: 0.9rem;
    padding: 8px 16px;
  }
}

.search-bar-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.search-bar {
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #d1d5db;
  border-radius: 20px;
  flex: 1;
  max-width: 300px;
  transition: all 0.3s ease;
}

.search-bar:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 5px rgba(79, 70, 229, 0.5);
}

.search-button {
  background-color: #3b82f6;
  color: white;
  border-radius: 20px;
  padding: 10px 20px;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  transition: all 0.
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes buttonBounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

</style>
