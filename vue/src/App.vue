<template>
  <div id="app">
    <h1>Welcome to Reaction404</h1>
    <p>Choose an option below:</p>
    <div class="button-container">
      <router-link to="/login">
        <button class="primary-button animated-button">Login</button>
      </router-link>
      <router-link to="/sign-in">
        <button class="secondary-button animated-button">Sign In</button>
      </router-link>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
/* App Styles */
#app {
  text-align: center;
  margin-top: 50px;
  font-family: "Poppins", sans-serif;
  color: #ffffff;
  background: linear-gradient(135deg, #1e3a8a, #6d28d9);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  animation: fadeIn 1s ease-in;
}
h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
  animation: slideDown 1s ease-in-out;
}
p {
  font-size: 1.2rem;
  margin-bottom: 30px;
}
.button-container {
  display: flex;
  justify-content: center;
  gap: 20px;
}
button {
  padding: 12px 20px;
  font-size: 1rem;
  border-radius: 50px;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease-in-out;
}
.primary-button {
  background-color: #4f46e5;
  color: white;
}
.primary-button:hover {
  background-color: #3730a3;
  transform: scale(1.1);
}
.secondary-button {
  background-color: #9333ea;
  color: white;
}
.secondary-button:hover {
  background-color: #6b21a8;
  transform: scale(1.1);
}
.animated-button {
  animation: buttonBounce 1.5s infinite;
}
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
}




/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes slideDown {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
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
