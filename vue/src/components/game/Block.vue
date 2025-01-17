<template>
  <div class="not_block" v-if="!showBlock" @click = "errorGame">
    wait for green..
  </div>
  <div class="block" v-if="showBlock" @click = "stopTimer">
    click me now!
  </div>
</template>

<script>
export default {
    props: ['delay'],
    data(){
        return{
            showBlock: false,
            timer: null,
            reactionTime: 0
        }
    },
    mounted(){
        console.log('component mounted')
        setTimeout(() => {
            this.showBlock = true
            this.startTimer()
        }, this.delay)
    },
    methods: {
        startTimer(){
            this.timer = setInterval(() => {
                this.reactionTime += 5
            },5)
        },
        stopTimer(){
            clearInterval(this.timer)
            this.$emit('end', this.reactionTime)
        },
        errorGame(){
            clearInterval(this.timer)
            this.$emit('error')
        }
    },
    updated(){
        console.log("updated")
    },
    unmounted(){
        console.log("unmounted")
    }
}
</script>

<style>
    .block{
        width: 400px;
        border-radius: 20px;
        background: #0faf87;
        color: white;
        text-align: center;
        padding: 100px 0;
        margin: 40px auto;
    }
    .not_block{
        width: 400px;
        border-radius: 20px;
        background: red;
        color: white;
        text-align: center;
        padding: 100px 0;
        margin: 40px auto;
    }
</style>