import express from 'express';
import { usersController } from '../Controllers/usersController.js';
import { jwtcheck  } from '../Controllers/authentication.js';

import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({storage: storage});
const upload_profile = upload.single("files");
import { store_files } from '../Controllers/storefiles.js';

export const user_router =  express.Router();

user_router.route("/register")
    .post(usersController.registeruser)

user_router.route("/register/:token")
    .get(usersController.activate_account)

user_router.route("/resetpassword")
    .post(usersController.reset_request)

user_router.route("/resetpassword/:token")
    .patch(usersController.reset_password)

user_router.route("/login")
    .post(usersController.login)

user_router.route("/verify_authentication").post(jwtcheck,usersController.verify_token)

user_router.route("/preferences/categories")
    .post(jwtcheck,usersController.add_category)

user_router.route("/id/:id/follow")
    .post(jwtcheck,usersController.follow)
    
user_router.route("/update")
    .get(jwtcheck,usersController.update_user_get)
    .put(jwtcheck,usersController.update_user_put)

user_router.route("/update/profile")
    .put(
        jwtcheck,
        upload_profile,
        store_files,
        usersController.update_profile)

