import express from 'express';
import { creatorsController } from './../Controllers/creatorsController.js';


export const creator_router =  express.Router();

creator_router.route("/")
    .get(creatorsController.getCreators)

creator_router.route("/id/:id")
    .get(creatorsController.getCreatorfromid)


