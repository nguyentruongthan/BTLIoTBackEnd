import mongoose from 'mongoose';
const sensorLogSchema = new mongoose.Schema({
  sensorID: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true,
  },
  timeStamp: {
    type: Date,
    default: () => {
      const now = new Date();
      now.setHours(now.getHours() + 7);
      return now;
    }
  }
});

let SensorLog = mongoose.model('SensorLog', sensorLogSchema);

export default {
  SensorLog: SensorLog
}