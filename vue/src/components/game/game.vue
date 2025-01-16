<template>
    <h1>Reaction404</h1>
    <button @click = "start" :disabled = "isPlaying"> play </button>
    <Block v-if="isPlaying" :delay="delay" @end="endGame" />
    <Results v-if="showResults" :score="score" />
  </template>
  
  <script>
  
  import Block from './Block.vue';
  import Results from './Results.vue';
  
  export default {
    name: 'App',
    components: { Block, Results },
    data() {
      return {
        isPlaying: false,
        delay: null,
        score: null,
        showResults: false,
      }
    },
    methods: {
      start() {
        this.delay = 2000 + Math.random() * 5000
        this.isPlaying = true
        this.showResults = false
      },

      async endGame(reactionTime) {
        this.score = reactionTime; 
        this.isPlaying = false; 
        this.showResults = true; 

        try {
          const response = await fetch('http://localhost:8080/users/insert_score', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username: this.$root.username,
              score: this.score,
            }),
          });
          if (response.ok) {
            const data = await response.json();
            console.log('insert success:', data);      
          } else {    
            const data = await response.json();
            console.error('insert Failed:', data);
          }     
        } catch (error) {
          console.error('Request failed:', error);
          console.log(error);
          alert('An error occurred. Please try again later.');
        }
      },
    }
  }
  </script>
  

  <style>
    #app {
      font-family: Avenir, Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-align: center;
      color: #444;
      margin-top: 60px;
    }
    button {
      background: #0faf87;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      font-size: 16px;
      letter-spacing: 1px;
      cursor: pointer;
      margin: 10px;
    }
    button[disabled] {
      opacity: 0.2;
      cursor: not-allowed;
    }
  </style>
  