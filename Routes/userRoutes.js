import express from 'express';
import { usersController } from '../Controllers/usersController.js';

export const user_router =  express.Router();

user_router.route("/register")
    .post(usersController.registeruser)

user_router.route("/login")
    .post(usersController.login)

user_router.route("/insert_score")
    .post(usersController.insert_score)

user_router.route("/userscore")
    .post(usersController.users_scores)