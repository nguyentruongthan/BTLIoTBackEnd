import taskLogModel from "../model/taskLogModel.js";
import constant from "../constant.js";

const taskLogsGlobal = {};
const resetStatusTaskLogs = async () => {
  for (let key in taskLogsGlobal) {
    if (!taskLogsGlobal[key]) {
      console.log(`taskLogsGlobal[${key}] is null`);
      continue;
    }
    taskLogsGlobal[key].status = constant.TASK_WAITING_STATUS;
  }
}
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
  //update cache 
  taskLogsGlobal[taskID] = taskLog;
  return savedTaskLog;
}
const getAllTaskLog = async () => {
  const taskLogs = await taskLogModel.TaskLog.find();
  //update taskLogsGlobal
  for (let taskLog of taskLogs) {
    taskLogsGlobal[taskLog.taskID] = taskLog;
  }
  return taskLogs;
}
const getTaskLogByTaskID = async (taskID) => {
  if (taskLogsGlobal[taskID]) {
    return taskLogsGlobal[taskID];
  } else {
    const taskLog = await taskLogModel.TaskLog.find({ taskID: taskID });
    if (taskLog.length == 0) {
      return null;
    }
    taskLogsGlobal[taskID] = taskLog[0];
    return taskLog[0];
  }
}
const deleteTaskLogByTaskID = async (taskID) => {
  if (taskLogsGlobal[taskID]) {
    //remove taskLog from taskLogsGlobal
    delete taskLogsGlobal[taskID];
  }
  await taskLogModel.TaskLog.deleteOne({
    taskID: taskID
  });
}
const updateTaskLog = async (taskID, key, value) => {
  const taskLog = await taskLogModel.TaskLog.findOne({ taskID: taskID });
  if(!taskLog) {
    return null;
  }
  resetStatusTaskLogs();
  taskLog[key] = (parseFloat(value) + parseFloat(taskLog[key])).toString();
  taskLog['status'] = constant.TASK_RUNNING_STATUS;  
  const updatedTaskLog = await taskLogModel.TaskLog.findOneAndUpdate(
    { taskID: taskID },
    taskLog,
    { new: true }
  );
  //update taskLog in taskLogsGlobal
  taskLogsGlobal[taskID] = updatedTaskLog;
  return updatedTaskLog;
}

export default {
  addTaskLog: addTaskLog,
  getAllTaskLog: getAllTaskLog,
  getTaskLogByTaskID: getTaskLogByTaskID,
  deleteTaskLogByTaskID: deleteTaskLogByTaskID,
  updateTaskLog: updateTaskLog
}
