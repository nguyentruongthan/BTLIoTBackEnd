import express from "express";
import schedulerController from "../controller/schedulerController.js";

let router = express.Router();
//get all Task
router.get('/', schedulerController.getAllTask);
// create a new Task
router.post('/', schedulerController.postTask);
//get a task by id
router.get('/:taskID', schedulerController.getTaskByID);
//update a task by id
router.put('/:taskID', schedulerController.updateTaskByID);
//delete a task by id
router.delete('/:taskID', schedulerController.deleteTaskByID);
export default router;