import express from 'express';
import { chatController } from './../Controllers/chatController.js'
import { jwtcheck  } from '../Controllers/authentication.js';

export const chat_router = express.Router();

chat_router.route("/")
    .get(jwtcheck, chatController.getChats)