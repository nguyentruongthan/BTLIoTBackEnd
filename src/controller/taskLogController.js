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
    const taskLogs = await taskLogService.getAllTaskLog();
    res.status(200).json(taskLogs);
  } catch (err) {
    res.status(500).json(err);
  }
}

const getTaskLogByTaskID = async (req, res) => {
  try {
    const taskID = req.params.taskID;
    const taskLog = await taskLogService.getTaskLogByTaskID(taskID);
    if (!taskLog) {
      return res.status(404).json("Task Log not found");
    }
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
    const key = req.body['key'];
    const value = req.body['value'];
    const updatedTaskLog = await taskLogService.updateTaskLog(taskID, key, value);
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