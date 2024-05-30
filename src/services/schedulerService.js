import taskModel from '../model/taskModel.js';

const getScheduler = async () => {
  const scheduler = await taskModel.Task.find();
  return scheduler;
}
const deleteTaskByID = async (taskID) => {
  await taskModel.Task.deleteOne({ _id: taskID });
}
const addTask = async (req) => {
  if (req.body['flow1'] == '') req.body['flow1'] = '0';
  if (req.body['flow2'] == '') req.body['flow2'] = '0';
  if (req.body['flow3'] == '') req.body['flow3'] = '0';

  const newTask = new taskModel.Task(req.body);
  const savedTask = await newTask.save();
  return savedTask;
}
const getTaskByID = async (taskID) => {
  const task = await taskModel.Task.findById(taskID);
  return task;
}
const updateTaskByID = async (taskID, task) => {
  const updatedTask = await taskModel.Task.findByIdAndUpdate
    (taskID, { $set: task }, { new: true });
  return updatedTask;
}

export default {
  getScheduler: getScheduler,
  deleteTaskById: deleteTaskByID,
  addTask: addTask,
  getTaskByID: getTaskByID,
  updateTaskByID: updateTaskByID
}