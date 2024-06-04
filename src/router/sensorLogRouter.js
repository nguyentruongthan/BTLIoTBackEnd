import express from "express";
import sensorLogController from "../controller/sensorLogController.js";

let router = express.Router();

//get sensor log by sensor id, date format: mm-dd-yyyy
router.get('/:sensorID/:date', sensorLogController.getSensorLogBySensorID);
// create a new Sensor log
router.post('/', sensorLogController.addSensorLog);

export default router;