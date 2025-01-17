import { createRouter, createWebHistory } from 'vue-router'
import Login from "../components/Login.vue"
import SignIn from "../components/SignIn.vue"
import Game from '../components/game/game.vue'
import Profile from '../components/Profile.vue'
import Leaderboard from '../components/Leaderboard.vue'
import Achievements from '../components/Achievements.vue'

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
    name: 'Game',
    component: Game
  },
  {
    path: '/profile/:nickname',
    name: 'Profile',
    component: Profile
  },
  {
    path: '/leaderboard',
    name: 'Leaderboard',
    component: Leaderboard
  },
  {
    path: '/profile/:nickname/achievements',
    name: 'Achievements',
    component: Achievements
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/', 
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
