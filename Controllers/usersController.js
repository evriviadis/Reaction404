import { user, category } from "../Database/database.js";
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { sendEmail } from '../Server/email.js';
import jwt from 'jsonwebtoken';
import { existsSync } from "fs";

const salt = bcrypt.genSaltSync(10);

const registeruser = async (req, res) => {
    try {
        const new_user = req.body;

        //CHECK IF USERNAME/EMAIL ALREADY IN USE
        const username_check = await user.findOne({ username: new_user.username });
        const email_check = await user.findOne({ email: new_user.email });
        if (username_check) {
            res.status(400).send({message:"Username already in use."});
        } else if (email_check) {
            res.status(400).send({message:"Email already in use. Try loggin in instead."});
        } else {

            //CREATING THE ENCODED PASSWORD
            const hash = await bcrypt.hash(new_user.password, salt);
            new_user.password = hash;

            //CREATING REGISTER TOKEN
            const register_token = crypto.randomBytes(32).toString('hex');
            const encrypted_register_token = crypto.createHash('sha256').update(register_token).digest('hex');

            //SAVE USER
            const save_user = new user({
                username: new_user.username,
                password: new_user.password,
                first_name: new_user.first_name,
                last_name: new_user.last_name,
                nickname: new_user.username, //STARTING nickname == username 
                email: new_user.email,
                region: new_user.region,
                phone: new_user.phone,
                register_token: encrypted_register_token,
                active: false
            });
            await save_user.save();

            //SENDING REGISTERATION EMAIL
            // const url = `${req.protocol}://${req.get('host')}/users/register/${register_token}`;
            try {


                const url = `https://api.worldthreesixty.com/users/register/${register_token}`;
                const message = `Please click the link to activate your account.\n ${url}`;
                await sendEmail({
                    email: save_user.email,
                    subject: 'Registration url',
                    message: message
                });
                res.status(200).send({message:"User registration successful. Please activate your account from the url in your e-mail."});
            } catch (error) {
                console.error(error);
                res.status(500).send({message:error});
            }
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
    const login_user = await user.findOne({ username: req.body.username });
    if (!login_user) {
        return res.status(401).send({message:"Cannod find user. Try another Username / Email.",errors:"User not found."});
    } else {
        try {
            //CHECK PASSWORD VALIDATION
            if (await bcrypt.compare(req.body.password, login_user.password)) {
                //CREATE LOGIN TOKEN
                const token = jwt.sign({ userid: login_user._id }, "THIS-STRING-IS-SECRET-AF", {
                    expiresIn: 31536000
                });
                const message = 'Log in successful!';
                //SENDING TOKEN BACK
                res.status(201).json({
                    status: 'success',
                    message: message,
                    user: {first_name:login_user.first_name,last_name:login_user.last_name,email:login_user.email,token: token},
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