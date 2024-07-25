import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import connectDB from './src/db/database.js';
import router from './src/routes/indexroute.js';

dotenv.config()

const app = express()

app.use(cors({origin:"*"}))
app.use(cors({ 
   origin: '*', 
   methods: 'GET,POST,PUT,DELETE', 
   allowedHeaders: 'Content-Type, Authorization'
 }));
 app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, application/json');
    next();
  });

// app.use(bodyParser.json())
app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use('/ticketdorm', router)

const startServer  = async () => {
   const PORT  = process.env.PORT || 2000
   connectDB()
   try {
      app.listen(PORT,() => {console.log(`TICKETDORM IS RUNNING ON PORT: ${PORT}`);})
   } catch (error) {
      console.log(error);
   }
};


startServer();

app.get("/", (req,res) => {
   res.send('API IS RUNNING')
})
