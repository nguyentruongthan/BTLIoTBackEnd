import mongoose from 'mongoose';
const taskSchema = new mongoose.Schema({
  taskID: {
    type: mongoose.Schema.Types.ObjectId,
    // required: true
  },
  gardenName: {
    type: String,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  stopTime: {
    type: String,
    required: true
  },
  cycle: {
    type: String,
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
  isActive: {
    type: String,
    required: true
  },
  schedulerName: {
    type: String,
    required: true
  },
});


let Task = mongoose.model('Task', taskSchema);

export default {
  Task: Task
}