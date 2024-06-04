import sensorLogModel from "../model/sensorLogModel.js";

const addSensorLog = async (sensorLog) => {
  const newSensorLog = new sensorLogModel.SensorLog(sensorLog);
  const savedSensorLog = await newSensorLog.save();
  return savedSensorLog;
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

export default {
  addSensorLog: addSensorLog,
  getSensorLogBySensorID: getSensorLogBySensorID
}