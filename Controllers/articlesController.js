import { article } from "../Database/database.js";


const getArticles = async (req, res) => {
    res.send(await article.find({}));
}

const getArticlefromid = async (req, res) => {
    const id = req.params.id;
    res.send(await article.find({_id: id}));
}

const todaysArticles = async (req, res) => {
    const now = new Date();
    
    //SET TODAY TO THE SAME FORMAT AS MONGODB
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    res.send(await article.find({createdAt: {$gte: today}}));
}

export const articlesController = {
    getArticles,
    getArticlefromid,
    todaysArticles
}