import { user, category } from "../Database/database.js";
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { sendEmail } from '../Server/email.js';
import jwt from 'jsonwebtoken';
import { existsSync } from "fs";

//Reaction404db
import {db} from '../Database/db_handler.js';
import { DeleteBucketLifecycleCommand } from "@aws-sdk/client-s3";

const salt = bcrypt.genSaltSync(10);

const registeruser = async (req, res) => {
    try {
        const new_user = req.body;

        //CHECK IF USERNAME/EMAIL ALREADY IN USE
        const username_check = await db.UsernameData(new_user.username);
        const nickname_check = await db.NicknameData(new_user.nickname);
        if (username_check || nickname_check) {
            console.log("username or nickname already in use");
            res.status(400).send({message:"Username or Nickname already in use."});
        } else {

            //CREATING THE ENCODED PASSWORD
            const hash = await bcrypt.hash(new_user.password, salt);
            new_user.password = hash;

            //SAVE USER
            db.insertUser(new_user.username, new_user.nickname, new_user.password);

            console.log("user successfully signed in");
            res.status(200).send({message:"user inserted in the database"});
        }
    } catch (error) {
        console.error(error);
        res.status(500).send();
    }
}

const activate_account = async (req, res) => {
    //ENCODE TOKEN
    const token = crypto.createHash('sha256').update(req.params.token).digest('hex');

    //CHECK VALIDATION
    const registered_user = await user.findOne({ register_token: token });
    if (!registered_user) {
        res.status(400).send("invalid token");
    } else {
        //ACTIVATE USER AND DELETE TOKEN 
        registered_user.active = true;
        registered_user.register_token = '';
        await registered_user.save();
        res.status(200).send({message:"Account activated"})
    }
}

const reset_request = async (req, res) => {
    //GETTING THE USER WITH THAT EMAIL
    const email = req.body.email;
    const email_user = await user.findOne({ email: email });

    if (!email_user) {
        res.status(400).send({message:"No user with that email."});
        return;
    }

    //GENERATE THE RESET TOKEN
    const reset_token = crypto.randomBytes(32).toString('hex');
    const encrypted_reset_token = crypto.createHash('sha256').update(reset_token).digest('hex');
    const token_expire = Date.now() + (10 * 60 * 1000);

    //UPDATE USERS TOKEN
    email_user.password_resset.token = encrypted_reset_token;
    email_user.password_resset.expire = token_expire;
    await email_user.save();

    //SEND THE TOKEN TO EMAIL
    const reset_url = `${req.protocol}://${req.get('host')}/users/resetpassword/${reset_token}`;
    const message = `Click the bellow link to reset your password\n
    ${reset_url}\n
    this link will expire in 10 minutes.`;
    try {
        await sendEmail({
            email: email_user.email,
            subject: 'Password reset request received :)',
            message: message
        });
        res.status(200).send({message:"Password reset link has been sent to User's email."});
    } catch (error) {
        res.status(500).send({message:`Error with sending email: ${error}`});
    }
}

const reset_password = async (req, res) => {
    //ENCODE TOKEN
    const token = crypto.createHash('sha256').update(req.params.token).digest('hex');

    //CHECK VALIDATION
    const data = await user.findOne({ email: req.body.email });
    if ((!data) || (data.password_resset.expire < Date.now()) || (data.password_resset.token !== token)) {
        res.status(400).send({message:"Invalid / Expired token."});
        return;
    }

    //ENCODE NEW PASSWORD AND SAVE IT
    const encrypted_password = await bcrypt.hash(req.body.password, salt);
    data.password = encrypted_password;
    data.password_resset.expire = Date.now();
    await data.save();

    res.send("we have done it boi!!!");
}

const login = async (req, res) => {
    //CHECK IF USER EXISTS
    const login_user = await db.UsernameData(req.body.username);
    if (!login_user) {
        console.log("no username match");
        return res.status(401).send({message:"Cannod find user. Try another Username / Email.",errors:"User not found.", status:401});
    } else {
        try {
            //CHECK PASSWORD VALIDATION
            if (await bcrypt.compare(req.body.password, login_user.password)) {
                //CREATE LOGIN TOKEN
                const token = jwt.sign({ userid: login_user.id }, "THIS-STRING-IS-SECRET-AF", {
                    expiresIn: 31536000
                });
                const message = 'Log in successful!';
                //SENDING TOKEN BACK
                res.status(201).json({
                    status: 'success',
                    message: message,
                    user: {username:login_user.username, nickname: login_user.nickname, token: token},
                    errors:{}
                })
            } else {
                console.log("error with login");
                res.status(401).send({message:"Wrong Username / Password. Try another combination.",errors:"Wrong username/password"})
                return ;
            }
        } catch {
            res.status(500).send();
        }
    }
}

const add_category = async (req, res) => {
    //GET THE CATEGORY CLASS AND USER DATA
    const newcategory = await category.findOne({ name: req.body.category })
    const theuser = req.user;

    //ADDING CATEGORY TO USER'S PREFERENCES
    theuser.preferences.categories.push(newcategory);
    await theuser.save();

    res.status(200).send({
        category: newcategory,
        username: theuser.username
    })
}

const follow = async (req, res) => {
    const theuser = req.user;
    const user_to_follow = await user.findOne({ _id: req.params.id });

    if (!user_to_follow) {
        res.status(400).send('no user with this id');
    }

    const exists = theuser.following.some(object => object._id === user_to_follow._id);

    if (exists) {
        let index1 = theuser.following.findIndex(object => object._id === user_to_follow._id);
        theuser.following.splice(index1, 1);
        let index2 = user_to_follow.followers.findIndex(object => object._id === theuser._id);
        user_to_follow.followers.splice(index2, 1);
        theuser.save();
        user_to_follow.save();
    } else {
        theuser.following.push(user_to_follow._id);
        user_to_follow.followers.push(theuser._id);
        theuser.save();
        user_to_follow.save();
    }

    res.status(200).send({message:'Successful follow/unfollow'});
}

const update_user_get = async (req, res) => {
    const theuser = await user.findOne({ _id: req.user._id });

    if (!theuser) {
        res.status(400).send("no user found");
    } else {
        const result = {
            "username": theuser.username,
            "first_name": theuser.first_name,
            "last_name": theuser.last_name,
            "email": theuser.email,
            "region": theuser.region,
            "phone": theuser.phone,
            "nickname": theuser.nickname
        }
        res.status(201).json({
            status: 'success',
            result
        })
    }
}

const update_user_put = async (req, res) => {
    const theuser = await user.findOne({ _id: req.user._id });
    const newuser = req.body;

    if (!theuser) {
        res.status(400).send("no user found");
    } else {
        theuser.username = newuser.username;
        theuser.first_name = newuser.first_name;
        theuser.last_name = newuser.last_name;
        theuser.region = newuser.region;
        theuser.phone = newuser.phone;
        theuser.email = newuser.email;
        theuser.nickname = newuser.nickname;
        await theuser.save();
        res.status(201).send({message:"user updated"});
    }
}

const update_profile = async (req, res) => {
    const theuser = await user.findOne({ _id: req.user._id });

    if (!theuser) {
        res.status(400).send({message:"user not found"});
    } else {
        for (let file of req.files) {
            theuser.photo_profile = file.originalname;
        }
        theuser.save();
        res.status(201).send({message:"profile updated"});
    }
    // den to exo fali documentation kai oute to exo testarei 
    // prepei na ginei me html file...
}

const verify_token = async (req, res) => {
    console.log("verifying token");
    if(req){
        console.log("req is there");
        const response = req.user;
        res.status(200).send(req.user);
    } else {
        res.status(500).send({message:"Expired Token"});
    }

}
export const usersController = {
    registeruser,
    activate_account,
    reset_request,
    reset_password,
    login,
    add_category,
    follow,
    update_user_get,
    update_user_put,
    update_profile,
    verify_token
}