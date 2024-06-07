import taskLogModel from "../model/taskLogModel.js";
import constant from "../constant.js";
const addTaskLog = async (taskID) => {
  const existingTaskLog = await taskLogModel.TaskLog.findOne(
    { taskID: taskID });
  if (existingTaskLog) {
    return existingTaskLog;
  }

  const taskLog = {
    taskID: taskID,
    flow1: "0",
    flow2: "0",
    flow3: "0",
    pumpIn: "0",
    pumpOut: "0",
    status: `${constant.TASK_WAITING_STATUS}`,//waiting
  };

  const newTaskLog = new taskLogModel.TaskLog(taskLog);
  const savedTaskLog = await newTaskLog.save();
  return savedTaskLog;
}
const getAllTaskLog = async () => {
  const taskLog = await taskLogModel.TaskLog.find();
  return taskLog;
}
const getTaskLogByTaskID = async (taskID) => {
  const taskLog = await taskLogModel.TaskLog.find({ taskID: taskID });
  return taskLog[0];
}
const deleteTaskLogByTaskID = async (taskID) => {
  const taskLog = await taskLogModel.TaskLog.deleteOne({
    taskID: taskID
  });
}
const updateTaskLog = async (taskID, taskLog) => {
  const updatedTaskLog = await taskLogModel.TaskLog.findOneAndUpdate(
    { taskID: taskID },
    taskLog,
    { new: true }
  );
  return updatedTaskLog;
}

export default {
  addTaskLog: addTaskLog,
  getAllTaskLog: getAllTaskLog,
  getTaskLogByTaskID: getTaskLogByTaskID,
  deleteTaskLogByTaskID: deleteTaskLogByTaskID,
  updateTaskLog: updateTaskLog
}
