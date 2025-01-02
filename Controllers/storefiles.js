import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import crypto from 'crypto';
import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({storage: storage});
import dotenv from 'dotenv';
import { json } from 'express';
dotenv.config();
const randomfilename = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');


export const store_files = async (req, res, next) =>{
    const s3 = new S3Client({
        credentials:{
            accessKeyId: process.env.ACCESS_KEY,
            secretAccessKey: process.env.SECRET_ACCESS_KEY,
        },
        region: process.env.BUCKET_REGION
    });

    try{
        for(let file of req.files){
            let random_name = randomfilename();
            
            const params = {
                Bucket: process.env.BUCKET_NAME,
                Key: random_name,
                Body: file.buffer,
                ContentType: file.mimetype
            }
    
            file.originalname = random_name;
            
            const command = new PutObjectCommand(params)
    
            await s3.send(command)
        }
         
       next();
    }catch(error){
        res.send(error);
    }
}

//THIS MIDDLEWARE IS ONLY FOR POSTMAN PERPUSE
//SO I CAN PURSE THE JSON WITH THE FILES

export const parseJsonMiddleware = (req, res, next) => {
    console.log(req.body)
    if (req.body.metadata) {
        try {
            console.log(JSON.parse(req.body.metadata))
            req.body = JSON.parse(req.body.metadata);
        } catch (err) {
            return res.status(400).json({ error: 'Invalid JSON in metadata field' });
        }
    }
    next();
};