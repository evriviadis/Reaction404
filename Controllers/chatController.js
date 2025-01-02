import { chat } from "../Database/database.js"

const getChats = async (req,res) => {
    const id = req.user.id;
    
    try {
        const chats = await chat.find({
            participants: id
        })
        
        if(chats){
            res.json({
                chats,
                status: 200,
                message: 'Start chating!!!'
            });
        }else{
            res.json({
                status: 201,
                message: 'No chat yet...'
            })
        }
    } catch (error) {
        res.json({
            status: 400,
            error,
            message: 'Server error'
        })
    }
}

export const chatController = {
    getChats
}