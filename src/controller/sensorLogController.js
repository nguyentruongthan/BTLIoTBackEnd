import sensorLogService from "../services/sensorLogService.js";

sensorLogService.initCatchSensorLog();

const addSensorLog = async (req, res) => {
  //call service add sensor log
  try {
    const savedSensorLog = await sensorLogService.addSensorLog(req.body);
    res.status(200).json(savedSensorLog);
  } catch (err) {
    res.status(500).json(err);
  }
}

const getSensorLogBySensorID = async (req, res) => {
  //call service get sensor log by sensorID
  try {
    const sensorID = req.params.sensorID;
    const date = req.params.date; //date format: mm-dd-yyyy
    const sensorLog = await sensorLogService.getSensorLogBySensorID(sensorID, date);
    res.status(200).json(sensorLog);
  } catch (err) {
    res.status(500).json(err);
  }
}

const getLatestSensorLog = async (req, res) => {
  try {
    const sensorLog = await sensorLogService.getLatestSensorLog();
    return res.status(200).json(sensorLog);
  } catch (err) {
    res.status(500).json(err);
  }
}

export default {
  addSensorLog: addSensorLog,
  getSensorLogBySensorID: getSensorLogBySensorID,
  getLatestSensorLog: getLatestSensorLog,
}