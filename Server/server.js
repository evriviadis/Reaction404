import swaggerJSDoc from 'swagger-jsdoc';
import swaggerui from 'swagger-ui-express';
import YAML from 'yamljs';
const swaggerDocument = YAML.load('./swagger.yaml');

import express from 'express';
import { article_router } from '../Routes/articleRoutes.js';
import { creator_router } from '../Routes/creatorRoutes.js';
import { user_router } from '../Routes/userRoutes.js';
import { content_router } from '../Routes/contentRoutes.js';
import { chat_router } from '../Routes/chatRoutes.js';

import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import crypto from 'crypto';
import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({storage: storage});
import dotenv from 'dotenv';
dotenv.config();
const randomfilename = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');


const app = express();

///////THIS PLACED FOR API DOC REASONS/////////
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
///////////////////////////////////////////////

app.use(cors())
app.use(express.json());

/* app.use(logger); */

//USE ROUTES
app.use('/articles', article_router);
app.use('/creators', creator_router);
app.use('/users', user_router);
app.use('/content', content_router);
app.use('/chat', chat_router)


//DEFAULT

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'start.html'));
})


app.post("/test", upload.array('files',10), async (req, res) => {
    console.log("req.file:", req.files);

    const s3 = new S3Client({
        credentials:{
            accessKeyId: process.env.ACCESS_KEY,
            secretAccessKey: process.env.SECRET_ACCESS_KEY,
        },
        region: process.env.BUCKET_REGION
    });

    for(let file of req.files){
        let params = {
            Bucket: process.env.BUCKET_NAME,
            Key: randomfilename(),
            Body: file.buffer,
            ContentType: file.mimetype
        }
    
        let command = new PutObjectCommand(params)
    
        await s3.send(command)
        //store the file into database
    }

    res.send({});
})

//SWAGGER STAFF
const options = {
    swaggerDefinition: {
        opanapi: "3.0.0",
        info: {
            title: "w360 api doc",
            version: "0.1",
            description: "this is the internal api documentation for w360!",
            contact: {
                name: "Evryviadis Liapis",
                email: "evris@liapis.info",
            },
        },
        servers: [
            {
                url: "http://localhost:8080/",
            },
        ],
    },
    apis: ["./Routes/*.js"],
}

const spacs = swaggerJSDoc(options);


app.use(
    "/api-docs",
    swaggerui.serve,
    swaggerui.setup(swaggerDocument)
)


//ERROR ROUTE
app.all("*", (req, res) =>{
    res.send(`boi we ain't have this url: ${req.originalUrl}.
    Please read my lovely api documentation
    tha ftiaxtei kapoia stigmi poy tha paei :)`)
})

//CREATE SERVER
const port = 8080;
app.listen(port, () =>{
    console.log(`this site is http://localhost:${port}`);
});
