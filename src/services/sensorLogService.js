import sensorLogModel from "../model/sensorLogModel.js";
let tempSensorValue = undefined;
let humiAirSensorValue = undefined;
let expectedAddDatabaseTime = 0;

const initCatchSensorLog = () => {
  const date = new Date();
  const minutes = date.getMinutes();
  expectedAddDatabaseTime = (date.getHours() * 60 + (10 * (Math.floor(minutes / 10)) + 10))%1440;
  console.log("expectedAddDatabaseTime: ", expectedAddDatabaseTime);
}


const addSensorLog = async (body) => {
  const newTempValue = body.tempValue;
  const newHumiAirValue = body.humiAirValue;
  if(newTempValue == undefined || newHumiAirValue == undefined) return;
  //update to cache
  tempSensorValue = newTempValue;
  humiAirSensorValue = newHumiAirValue;
  //get current minute
  const date = new Date();
  const minutes = date.getHours()*60 + date.getMinutes();
  //humidity air sensor
  if (minutes >= expectedAddDatabaseTime && minutes % 10 == 0) {
    //update to adtabase
    console.log("add sensor log to database");
    //add humi air sensor
    const newHumiAirLog = new sensorLogModel.SensorLog(
      {sensorID: '2', value: newHumiAirValue}
    );
    await newHumiAirLog.save();

    //add temp sensor
    const newTempLog = new sensorLogModel.SensorLog(
      {sensorID: '3', value: newTempValue}
    );
    await newTempLog.save();
    //update expected time
    expectedAddDatabaseTime = (minutes + 10)%1440;
  }
}

const getSensorLogBySensorID = async (sensorID, date) => {
  // Chuyển đổi đầu vào `date` thành đối tượng Date
  const startOfDay = new Date(date);
  startOfDay.setHours(0 + 7, 0, 0, 0); // Đặt giờ phút giây mili giây về 0

  const endOfDay = new Date(date);
  endOfDay.setHours(23 + 7, 59, 59, 999); // Đặt giờ phút giây mili giây về cuối ngày
  // Tìm tất cả các bản ghi của sensorID trong khoảng thời gian từ `startOfDay` đến `endOfDay`
  const sensorLog = await sensorLogModel.SensorLog.find({
    sensorID: sensorID,
    timeStamp: {
      $gte: startOfDay,
      $lte: endOfDay
    }
  });
  
  return sensorLog;
}

const getLatestSensorLog = async () => {
  let result = {};
  
  // find latest value in cache 
  if (!humiAirSensorValue) {
    // find latest record of sensorID
    const sensorLog = await sensorLogModel.SensorLog.findOne({
      sensorID: '2'
    }).sort({ timeStamp: -1 });
    //update cache
    humiAirSensorValue = sensorLog.value; 
  }
  result['humiAir'] = humiAirSensorValue;
  if (!tempSensorValue) {
    // find latest record of sensorID
    const sensorLog = await sensorLogModel.SensorLog.findOne({
      sensorID: '3'
    }).sort({ timeStamp: -1 });
    //update cache
    tempSensorValue = sensorLog.value;
  }
  result['temp'] = tempSensorValue;
  return result;
}


export default {
  addSensorLog: addSensorLog,
  getSensorLogBySensorID: getSensorLogBySensorID,
  getLatestSensorLog: getLatestSensorLog,
  initCatchSensorLog: initCatchSensorLog,
}