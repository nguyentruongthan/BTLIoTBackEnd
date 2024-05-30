import taskLogService from "../services/taskLogService.js"

const addTaskLog = async (req, res) => {
  try {
    const taskID = req.body['taskID'];
    const taskLog = await taskLogService.addTaskLog(taskID);
    res.status(200).json(taskLog);
  } catch (err) {
    res.status(500).json(err);
  }
}

const getAllTaskLog = async (req, res) => {
  try {
    const taskLog = await taskLogService.getAllTaskLog();
    res.status(200).json(taskLog);
  } catch (err) {
    res.status(500).json(err);
  }
}

const getTaskLogByTaskID = async (req, res) => {
  try {
    const taskLog = await taskLogService.getTaskLogByTaskID(req.params.taskID);
    res.status(200).json(taskLog);
  } catch (err) {
    res.status(500).json(err);
  }
}
const deleteTaskLogByTaskID = async (req, res) => {
  try {
    await taskLogService.deleteTaskLogByTaskID(req.params.taskID);
    res.status(200).json("Task Log has been deleted");
  } catch (err) {
    res.status(500).json(err);
  }
}
const updateTaskLog = async (req, res) => {
  try {
    const taskID = req.params.taskID;
    const taskLog = req.body;
    const updatedTaskLog = await taskLogService.updateTaskLog(taskID, taskLog);
    res.status(200).json(updatedTaskLog);
  } catch (err) {
    res.status(500).json(err);
  }
}
export default {
  addTaskLog: addTaskLog,
  getAllTaskLog: getAllTaskLog,
  getTaskLogByTaskID: getTaskLogByTaskID,
  deleteTaskLogByTaskID: deleteTaskLogByTaskID,
  updateTaskLog: updateTaskLog
}