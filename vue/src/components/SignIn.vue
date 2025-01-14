<template>
    <div class="sign-in-page">
      <h2>Sign In Page</h2>
      <p>Create your account by filling in the details below:</p>
      <form @submit.prevent="handleSignIn" class="form-container">
        <input type="text" placeholder="Username" class="input-field" v-model="username" />
        <input type="nickname" placeholder="Nickname" class="input-field" v-model="nickname"/>
        <input type="password" placeholder="Password" class="input-field" v-model="password" />
        <button type="submit" class="secondary-button animated-button">Sign Up</button>
      </form>
    </div>
  </template>
  
  <script>
    export default {
        data() {
            return {
                username: '',
                nickname: '',
                password: '',
            };
        },
        methods: {
            async handleSignIn() {
                console.log('Sign In Attempt');
                console.log('Username:', this.username);
                console.log('nickname:', this.nickname);
                console.log('Password:', this.password);
                
                try {
                    const response = await fetch('http://localhost:8080/users/register', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            username: this.username,
                            nickname: this.nickname,
                            password: this.password,
                        }),
                });

                // Handle the response
                if (response.ok) {
                    const data = await response.json();
                    console.log('Login Success:', data);
                    // Handle successful login (redirect, store token, etc.)

                    this.$root.login = true;
                    this.$router.push({name: 'game'});
                } else {
                    const data = await response.json();
                    console.log('Login Failed:', data);
                    console.log("status:",response.status);
                    console.error('Login Failed:', response.status);
                    // Handle login failure (show error message, etc.)
                }
            } catch (error) {
                console.log("error aderfe");
                console.error('Request failed', error);
                // Handle network errors or unexpected issues
            }
            },
        },
    };
  </script>
  
  <style>
  /* Sign-In Page Styles */
  .sign-in-page {
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
    border: 2px solid #9333ea;
    border-radius: 50px;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
  }
  .input-field:focus {
    border-color: #4f46e5;
    box-shadow: 0 0 10px #4f46e5;
    outline: none;
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
  </style>
  