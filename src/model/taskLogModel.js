import mongoose from 'mongoose';
const taskLogSchema = new mongoose.Schema({
  taskID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  flow1: {
    type: String,
    required: true
  },
  flow2: {
    type: String,
    required: true
  },
  flow3: {
    type: String,
    required: true
  },
  pumpIn: {
    type: String,
    required: true
  },
  pumpOut: {
    type: String, 
    required: true
  },
  status: {
    type: String, //waiting = 0, processing = 1, complete = 2
    required: true
  },
});


let TaskLog = mongoose.model('TaskLog', taskLogSchema);

export default {
  TaskLog: TaskLog
}