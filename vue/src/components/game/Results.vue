<template>
    <p> Reaction time = {{score}} ms </p>
    <p class="rank"> {{ rank }} </p>
</template>

<script>
export default {
    props: ['score'],
    data() {
        return{
            rank: null
        }
    },
    mounted(){
        if(this.score < 100){
            this.rank = "Hacker"
        } 
        if(this.score < 200){
            this.rank = "Rapid Reflexes"
        }else if(this.score < 300){
            this.rank = "Snail pace..."
        }else{
            this.rank = "Too slow :("
        }
    }
}
</script>

<style>
    .rank{
        font-size: 1.4em;
        color: #0faf87;
        font-weight: bold;
    }
</style>