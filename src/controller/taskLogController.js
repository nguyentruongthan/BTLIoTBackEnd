import taskLogService from "../services/taskLogService.js"

const taskLogsGlobal = {};

const addTaskLog = async (req, res) => {
  try {
    const taskID = req.body['taskID'];
    const taskLog = await taskLogService.addTaskLog(taskID);
    //update taskLogsGlobal
    taskLogsGlobal[taskID] = taskLog;
    res.status(200).json(taskLog);
  } catch (err) {
    res.status(500).json(err);
  }
}

const getAllTaskLog = async (req, res) => {
  try {
    const taskLogs = await taskLogService.getAllTaskLog();
    //update taskLogsGlobal
    for (let taskLog of taskLogs) {
      taskLogsGlobal[taskLog.taskID] = taskLog;
    }
    res.status(200).json(taskLogs);
  } catch (err) {
    res.status(500).json(err);
  }
}

const getTaskLogByTaskID = async (req, res) => {
  try {
    const taskID = req.params.taskID;
    if (taskLogsGlobal[taskID]) {
      // console.log("taskLogsGlobal[taskID] is used")
      res.status(200).json(taskLogsGlobal[taskID]);
      return;
    } else {
      // console.log("taskLogsGlobal[taskID] is not used");
      const taskLog = await taskLogService.getTaskLogByTaskID(taskID);
      if (taskLog) {
        taskLogsGlobal[taskID] = taskLog;
      }
      res.status(200).json(taskLog);
      return;
    }
  } catch (err) {
    res.status(500).json(err);
  }
}
const deleteTaskLogByTaskID = async (req, res) => {
  try {
    await taskLogService.deleteTaskLogByTaskID(req.params.taskID);
    //remove taskLog from taskLogsGlobal
    delete taskLogsGlobal[req.params.taskID];
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
    //update taskLog in taskLogsGlobal
    taskLogsGlobal[taskID] = updatedTaskLog;
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