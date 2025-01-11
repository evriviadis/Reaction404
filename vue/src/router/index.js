import { createRouter, createWebHistory } from 'vue-router'
import Login from "../components/Login.vue"
import SignIn from "../components/SignIn.vue"

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
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
