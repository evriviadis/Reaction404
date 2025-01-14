import crypto from 'crypto';
import bcrypt from 'bcrypt';

//Reaction404db
import {db} from '../Database/db_handler.js';

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
                const message = 'Log in successful!';
                //SENDING TOKEN BACK
                res.status(201).json({
                    status: 'success',
                    message: message,
                    user: {username:login_user.username, nickname: login_user.nickname},
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

const users_scores = async (req, res) => {
    const user = await db.UsernameData(req.body.username);

    const scores = await db.getUserScores(user.id);
    res.status(200).send({message:"scores found", scores: scores});
}

const insert_score = async (req, res) => {
    const user = await db.UsernameData(req.body.username);

    await db.insertScore(user.id,req.body.score);
    res.status(200).send({message:"insert success"});
}

export const usersController = {
    registeruser,
    login,
    insert_score,
    users_scores,
}