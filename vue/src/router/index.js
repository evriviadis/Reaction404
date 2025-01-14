import { createRouter, createWebHistory } from 'vue-router'
import Login from "../components/Login.vue"
import SignIn from "../components/SignIn.vue"
import game from '../components/game/game.vue'
import profile from '../components/Profile.vue'

const routes = [
  {
    path: '/',
    name: 'home',
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/sign-in',
    name: 'SignIn',
    component: SignIn
  },
  {
    path: '/game',
    name: 'game',
    component: game
  },
  {
    path: '/profile',
    name: 'profile',
    component: profile
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
