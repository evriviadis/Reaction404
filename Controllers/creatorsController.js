import { creator } from "../Database/database.js";


const getCreators = async (req, res) => {
    res.send(await creator.find({}));
}

const getCreatorfromid = async (req, res) => {
    const id = req.params.id;
    res.send(await creator.find({_id: id}));
}

export const creatorsController = {
    getCreators,
    getCreatorfromid
}