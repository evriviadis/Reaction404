import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config(); // Load .env file

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:{
        rejectUnauthorized: false,
    },
});

/* const Database = "reaction404_db";
const UserName = "chrismountakis";
const password = "code";
const port = 5432;
const host = "localhost"; 

const Database = "Reaction404_db";
const UserName = "evryviadisliapis";
const password = "code";
const port = 5432;
const host = 'localhost';


const pool = new Pool({
    user: UserName,
    host: host,
    database: Database,
    password: password,
    port: port,
}); */



async function executeQuery(query, params = []) {
    try {
        const result = await pool.query(query, params);
        console.log('Query successful:', result.rows);
        return result.rows;
    } catch (error) {
        console.error('Error executing query:', error);
    }
}

// print all users data
async function users(){
    const Query = 'SELECT * FROM users;';
    const Params = [];

    const result = await executeQuery(Query,Params);
    return result;
}

async function achievements(){
    const Query = 'SELECT * FROM achievements;';
    const Params = [];

    const result = await executeQuery(Query,Params);
    return result;
}

//print data for a user
async function UsersData(id){
    const Query = 'SELECT * FROM users WHERE id = $1';
    const Params = [id];

    const [result] = await executeQuery(Query,Params);
    return result;
}

//get user from username
async function UsernameData(username){
    const Query = 'SELECT * FROM users WHERE username = $1';
    const Params = [username];

    const [result] = await executeQuery(Query,Params);
    return result;
}

//get user from nickname
async function NicknameData(nickname){
    const Query = 'SELECT * FROM users WHERE nickname = $1';
    const Params = [nickname];

    const [result] = await executeQuery(Query,Params);
    return result;
}


//insert user
async function insertUser(username, nickname, password) {
    const Query = 'INSERT into users (username, nickname, password) VALUES ($1, $2, $3)';
    const Params = [username, nickname, password];

    try {
        const result = await executeQuery(Query,Params);
        console.log('User inserted successfully');
    } catch (err) {
        console.error('Error inserting user:', err);
    }
}

//insert score
async function insertScore(user_id, score) {
    const Query = 'INSERT into scores (user_id, score) VALUES ($1, $2)';
    const Params = [user_id, score];

    try {
        const result = await executeQuery(Query,Params);
        console.log('Score inserted successfully');
    } catch (err) {
        console.error('Error inserting score:', err);
    }
}

//get top ten scores
async function getTopScores() {
    const Query = 'SELECT u.nickname, MIN(s.score) AS highest_score FROM scores s JOIN users u ON s.user_id = u.id GROUP BY u.id, u.nickname ORDER BY highest_score ASC LIMIT 10;';
    const Params = [];

    try {
        const result = await executeQuery(Query,Params);
        return result;
    } catch (err) {
        console.error('top 10 scores failed:', err);
    }
}

async function getUserScores(user_id) {
    const Query = 'SELECT s.score FROM scores s WHERE s.user_id = $1 ORDER BY s.score ASC LIMIT 3;';
    const Params = [user_id];

    try {
        const result = await executeQuery(Query,Params);
        return result;
    } catch (err) {
        console.error('scores failed:', err);
    }
}

async function GamesNumber(user_id) {
    const Query = 'SELECT COUNT(*) AS games_played FROM scores WHERE user_id = $1;';
    const Params = [user_id];

    try {
        const result = await executeQuery(Query,Params);
        return result;
    } catch (err) {
        console.error('games number failed', err);
    }
}

async function getUserTopScore(user_id) {
    const Query = 'SELECT s.score FROM scores s WHERE s.user_id = $1 ORDER BY s.score ASC LIMIT 1;';
    const Params = [user_id];

    try {
        const result = await executeQuery(Query,Params);
        return result;
    } catch (err) {
        console.error('user top score failed', err);
    }
}

async function isUserTop10(user_id) {
    const Query = 'SELECT 1 FROM (SELECT user_id FROM scores ORDER BY score ASC LIMIT 10) AS top_users WHERE user_id = $1 limit 1';
    const Params = [user_id];

    try {
        const result = await executeQuery(Query,Params);
        return result;
    } catch (err) {
        console.error('IsUserTop10 failed', err);
    }
}

async function getAchievements(user_id) {
    const Query = 'SELECT achievement_id, achieved_at FROM user_achievements WHERE user_id = $1';
    const Params = [user_id];

    try {
        const result = await executeQuery(Query,Params);
        return result;
    } catch (err) {
        console.error('getAchievements failed', err);
    }
}

async function wonAchievement(user_id, achievement_id){
    const Query = 'INSERT INTO user_achievements (user_id, achievement_id) VALUES ($1, $2);';
    const Params = [user_id, achievement_id];

    try {
        const result = await executeQuery(Query,Params);
        return result;
    } catch (err) {
        console.error('wonAchievement failed', err);
    }
}

(async () => {
    users();
    getTopScores();
    achievements();
})();


//export all functions
export const db = {
    users,
    UsersData,
    UsernameData,
    insertUser,
    insertScore,
    getTopScores,
    NicknameData,
    getUserScores,
    GamesNumber,
    getUserTopScore,
    isUserTop10,
    getAchievements,
    wonAchievement,
    achievements
}