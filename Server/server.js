import express from 'express';
import { user_router } from '../Routes/userRoutes.js';

import cors from 'cors';


import dotenv from 'dotenv';
dotenv.config();


const app = express();

///////THIS PLACED FOR API DOC REASONS/////////
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
///////////////////////////////////////////////

app.use(cors())
app.use(express.json());

/* app.use(logger); */

//USE ROUTES
app.use('/users', user_router);

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
