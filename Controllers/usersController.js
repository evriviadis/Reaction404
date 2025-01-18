import crypto from 'crypto';
import bcrypt from 'bcrypt';

//Reaction404db
import {db} from '../Database/db_handler.js';

const salt = bcrypt.genSaltSync(10);

const registeruser = async (req, res) => {
    try {
        const new_user = req.body;

        //CHECK IF USERNAME/NICKNAME ALREADY IN USE
        const username_check = await db.UsernameData(new_user.username);
        const nickname_check = await db.NicknameData(new_user.nickname);
        if (username_check || nickname_check) {
            console.log("Username or Nickname already in use");
            res.status(400).send({message:"Username or Nickname already in use."});
        } else {

            //CREATING THE ENCODED PASSWORD
            const hash = await bcrypt.hash(new_user.password, salt);
            new_user.password = hash;

            //SAVE USER
            db.insertUser(new_user.username, new_user.nickname, new_user.password);

            console.log("User successfully signed in");
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
        return res.status(401).send({message:"Cannot find user. Try another Username / Email.",errors:"User not found.", status:401});
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
    console.log(req.body.nickname);
    const user = await db.NicknameData(req.body.nickname);
    console.log(user);

    const scores = await db.getUserScores(user.id);
    res.status(200).send({message:"scores found", scores: scores});
}

const insert_score = async (req, res) => {
    const user = await db.UsernameData(req.body.username);
    await db.insertScore(user.id, req.body.score);


    const [numberOfGames] = await db.GamesNumber(user.id);
    if(numberOfGames.games_played == 1){
        db.wonAchievement(user.id, 4);
    }else if(numberOfGames.games_played == 10){
        db.wonAchievement(user.id, 5);
    }else if(numberOfGames.games_played == 100){
        db.wonAchievement(user.id, 6);
    }

    const array = await db.getAchievements(user.id);

    const professional = await db.isUserTop10(user.id);
    if(professional){
        const isProfessional = array.some(item => item.achievement_id === 7); //prof id
        if(!isProfessional){
            db.wonAchievement(user.id, 7);
        }else{
            console.log("professional achievement exists");
        }
    }

    const topScore = await db.getUserTopScore(user.id);
    
    if(topScore[0].score < 300){
        const isSnailPace = array.some(item => item.achievement_id === 1); // snail pace id
        if(!isSnailPace){
            db.wonAchievement(user.id, 1);
        }else{
            console.log("snail pace achievement exists");
        }    
    }
    if(topScore[0].score < 200){
        const isRapidReflexes = array.some(item => item.achievement_id === 2); // snail pace id
        if(!isRapidReflexes){
            db.wonAchievement(user.id, 2);
        }else{
            console.log("rapid reflexes achievement exists");
        }   
    }
    if(topScore[0].score < 100){
        const isHacker = array.some(item => item.achievement_id === 3);
        if(!isHacker){
            db.wonAchievement(user.id, 3);
        }else{
            console.log("hacker achievement exists");
        }
    }

    res.status(200).send({message:"insert success"});
}

const getLeaderboard = async (req, res) => {
    const scores = await db.getTopScores();
    res.status(200).send({messege: "got top scores", scores:scores});
}

const check_nickname = async (req, res) => {
    const user = await db.NicknameData(req.body.nickname);
    
    if(user){
        res.status(200).send({messege: "user found"});
    }else{
        res.status(400).send({message: "user not found"});
    }
}

const achievements = async (req, res) => {
    const user = await db.NicknameData(req.body.nickname);
    console.log(user);
    const achievements = await db.getAchievements(user.id);

    const achievementDatabase = await db.achievements();

    res.status(200).send({message:"got achievements", achievements, achievementDatabase});
}

export const usersController = {
    registeruser,
    login,
    insert_score,
    users_scores,
    getLeaderboard,
    check_nickname,
    achievements
}