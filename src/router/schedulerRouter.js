import express from "express";
import schedulerController from "../controller/schedulerController.js";

let router = express.Router();
//get all Task
router.get('/', schedulerController.getAllTask);
// create a new Task
router.post('/', schedulerController.postTask);
//get a task by id
router.get('/:id', schedulerController.getTaskById);
//update a task by id
router.put('/:id', schedulerController.updateTaskById);
//delete a task by id
router.delete('/:id', schedulerController.deleteTaskById);
export default router;