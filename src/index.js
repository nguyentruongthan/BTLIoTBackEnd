import express from "express";
import bodyParser from "body-parser";

import cors from 'cors';
import mqttClient from './controller/mqttController.js';
import mongoose from 'mongoose';
import schedulerRouter from './router/schedulerRouter.js';
import taskLogRouter from './router/taskLogRouter.js';
import sensorLogRouter from './router/sensorLogRouter.js';
import loginRouter from './router/loginRouter.js';
let app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

app.use("/scheduler", schedulerRouter)
app.use("/taskLog", taskLogRouter)
app.use("/sensorLog", sensorLogRouter)
app.use("/login", loginRouter)

mongoose.connect(
  `mongodb+srv://thannguyenxlscpy:${process.env.DATABASE_PASSWORD}@cluster0.ozvz1fi.mongodb.net/Node-API?retryWrites=true&w=majority&appName=Cluster0`)
  .then(() => {
    console.log('Connected to mongodb');
    let port = 8000;
    app.listen(port, () => {
      console.log(`Server running at: http://localhost:${port}`);
    });
  })
  .catch((err) => console.log(err))





