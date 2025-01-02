import jwt from 'jsonwebtoken';
import util from 'util';
import { user } from "../Database/database.js";

export const jwtcheck = async (req, res, next) => {
    const testToken = req.headers.authorization;
    let token;
    console.log("printing testToken: ");
    console.log("---");
    console.log(testToken);
    console.log("---");
    try {

        //CHECK IF TOKEN EXISTS
        if (testToken && testToken.startsWith('Bearer')) {
            token = testToken.split(' ')[1];
        }

        //CHECK TOKEN VALIDATION 
        const tokenexist = await util.promisify(jwt.verify)(token, process.env.SECRET_STR);
        if (!tokenexist) {
            console.log("not valid token");
            res.status(401).send("Not valid token");
        }

        //CHECK IF USER EXISTS 
        // console.log("Checking if User with Userid:" +tokenexist.userid+ " exists?");
        const isuser = await user.findOne({ _id: tokenexist.userid });
        if (!isuser) {
            console.log("user not found");
            res.status(401).send({message:"User not found."});
            next();
        } else {
            // console.log("found user!");
        }

        //CHECK IF USER IS ACTIVE 
        if (!isuser.active) {
            console.log("user not active");
            res.status(401).send({message:"User inactive"});
            next();
        }
        


        req.user = isuser.toObject();
        req.user.token = token;
        console.log("authentication request");
        console.log(req.user);
        next();

    } catch (error) {
        console.error(error);
        next();
    }

}
