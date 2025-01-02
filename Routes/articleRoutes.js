import express from 'express';
import { articlesController } from './../Controllers/articlesController.js'
import { jwtcheck  } from '../Controllers/authentication.js';

export const article_router =  express.Router();

article_router.route("/")
    .get(jwtcheck, articlesController.getArticles)

article_router.route("/id/:id")
    .get(articlesController.getArticlefromid)

article_router.route("/today")
    .get(articlesController.todaysArticles)