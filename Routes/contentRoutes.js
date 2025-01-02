import express from 'express';
import { contentController } from '../Controllers/contentsController.js';
import { jwtcheck  } from '../Controllers/authentication.js';
import { content } from '../Database/database.js';

//STORE FILES MIDDLEWARE

import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({storage: storage});
const upload_files_middleware = upload.array('files',10);
import { store_files, parseJsonMiddleware } from '../Controllers/storefiles.js';



/* const multerErrorHandlingMiddleware = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        // Handle Multer-specific errors
        res.status(400).json({ error: err.message });
    } else if (err) {
        // Handle other errors
        res.status(500).json({ error: 'An unknown error occurred during the upload process' });
    } else {
        next();
    }
};

const logRequestBodyMiddleware = (req, res, next) => {
    console.log('Incoming form data:', req.body);
    next();
};
 */


export const content_router =  express.Router();

content_router.route("/")
    .get(contentController.getcontents)

content_router.route("/post")
    .post(jwtcheck,
        upload_files_middleware,
        store_files,
        contentController.postcontent)

content_router.route("/id/:id/delete")
    .delete(jwtcheck,contentController.deletecontent)

content_router.route("/id/:id/edit")
    .get(jwtcheck,contentController.editcontent)
    .put(jwtcheck,contentController.posteditcontent)

content_router.route("/id/:id/comment")
    .post(jwtcheck,contentController.postcomment)

content_router.route("/id/:id/comment/id/:comment_id/edit")
    .get(jwtcheck,contentController.editcomment)
    .put(jwtcheck,contentController.posteditcomment)

content_router.route("/id/:id/comment/id/:comment_id/delete")
    .delete(jwtcheck,contentController.deletecomment)

content_router.route("/id/:id/save")
    .get(jwtcheck,contentController.savecontent)
    .delete(jwtcheck,contentController.deletesavecontent)

content_router.route("/id/:id/react")
    .post(jwtcheck,contentController.reacttocontent)

//this path is for w360map.html only 
content_router.route("/map_demo")
    .get(contentController.get_locations)

content_router.route("/screen_posts")
    .get(jwtcheck,contentController.screen_posts)