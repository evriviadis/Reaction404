<template>
  <div class="login-page">
    <h2>Login Page</h2>
    <p>Please enter your login details below:</p>
    <form @submit.prevent="handleLogin" class="form-container">
      <input type="text" placeholder="Username" class="input-field" v-model="username" />
      <input type="password" placeholder="Password" class="input-field" v-model="password" />
      <button type="submit" class="primary-button animated-button">Login</button>
    </form>
  </div>
</template>

<script>
import { inject } from 'vue';

export default {
  data() {
    return {
      username: '',
      password: '',
    };
  },
  methods: {
    async handleLogin() {
      console.log('Login Attempt');
      console.log('Username:', this.username);
      console.log('Password:', this.password);

      try {
        const response = await fetch('http://localhost:8080/users/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: this.username,
            password: this.password,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Login Success:', data);

          // Update global login state
          this.$root.login = true;
          this.$root.username = this.username;
          this.$root.nickname = data.user.nickname;

          // Redirect or perform post-login actions
          this.$router.push({name: 'Game'}); 
        } else {
          const data = await response.json();
          console.error('Login Failed:', data);
          alert('Invalid login credentials. Please try again.');
        }
      } catch (error) {
        console.error('Request failed:', error);
        console.log(error);
        alert('An error occurred. Please try again later.');
      }
    },
  },
};
</script>
  
  <style>
  /* Login Page Styles */
  .login-page {
    text-align: center;
    padding: 20px;
    animation: fadeIn 1s ease-in;
  }
  h2 {
    font-size: 2rem;
    color: #ffffff;
    margin-bottom: 15px;
    animation: slideDown 1s ease-in-out;
  }
  p {
    font-size: 1rem;
    color: #e0e0e0;
    margin-bottom: 20px;
  }
  .form-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
  }
  .input-field {
    width: 300px;
    padding: 10px;
    font-size: 1rem;
    border: 2px solid #4f46e5;
    border-radius: 50px;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
  }
  .input-field:focus {
    border-color: #9333ea;
    box-shadow: 0 0 10px #9333ea;
    outline: none;
  }
  .primary-button {
    background-color: #4f46e5;
    color: white;
  }
  .primary-button:hover {
    background-color: #3730a3;
    transform: scale(1.1);
  }
  .animated-button {
    animation: buttonBounce 1.5s infinite;
  }
  </style>
  