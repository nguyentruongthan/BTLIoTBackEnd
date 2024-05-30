import express from "express";
import taskLogController from "../controller/taskLogController.js";

let router = express.Router();

//get all Task log
router.get('/', taskLogController.getAllTaskLog);
// create a new Task log
router.post('/', taskLogController.addTaskLog);
//get a task by log id
router.get('/:taskID', taskLogController.getTaskLogByTaskID);
// //update a task log by id
router.put('/:taskID', taskLogController.updateTaskLog);
//delete a task log by id
router.delete('/:taskID', taskLogController.deleteTaskLogByTaskID); 

export default router;