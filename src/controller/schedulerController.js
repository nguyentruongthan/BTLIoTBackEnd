import taskModel from '../model/taskModel.js';
import schedulerService from '../services/schedulerService.js';
import taskLogService from '../services/taskLogService.js';

const getAllTask = async (req, res) => {
  try {
    const scheduler = await schedulerService.getScheduler();
    res.status(200).json(scheduler);
  } catch (err) {
    res.status(500).json(err);
  }
}
const postTask = async (req, res) => {
  try {
    //check start time less than stop time
    if (parseInt(req.body.startTime) >= parseInt(req.body.stopTime)) {
      return res.status(400).json('Start time must be less than stop time');
    } 

    //check pumpIn
    if (req.body['pumpIn'] == '') return res.status(400).json('PumpIn must be filled');

    //set isActive to 1
    req.body['isActive'] = '1';
    //call service add task
    const savedTask = await schedulerService.addTask(req);
    //call service add task log
    await taskLogService.addTaskLog(savedTask._id);
    res.status(200).json(savedTask);
  } catch (err) {
    res.status(500).json(err);
  }
}
const getTaskByID = async (req, res) => {
  try {
    const task = await schedulerService.getTaskByID(req.params.taskID);
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json(err);
  }
}
const updateTaskByID = async (req, res) => {
  try {
    const updatedTask = await schedulerService.updateTaskByID(req.params.taskID, req.body);
    res.status(200).json(updatedTask);
  } catch (err) {
    res.status(500).json(err);
  }
}
const deleteTaskByID = async (req, res) => {
  try {
    //call service delete task 
    await schedulerService.deleteTaskByID(req.params.taskID);
    //call service delete task log
    await taskLogService.deleteTaskLogByTaskID(req.params.taskID);
    res.status(200).json('Task has been deleted');
  } catch (err) {
    res.status(500).json(err);
  }
}

export default {
  getAllTask: getAllTask,
  postTask: postTask,
  getTaskByID: getTaskByID,
  updateTaskByID: updateTaskByID,
  deleteTaskByID: deleteTaskByID,
}