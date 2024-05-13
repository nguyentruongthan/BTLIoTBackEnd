import express from "express";
import taskController from "../controllers/taskController.js";

let router = express.Router();
//get all Task
router.get('/', taskController.getAllTask);
// create a new Task
router.post('/', taskController.postTask);
//get a task by id
router.get('/:id', taskController.getTaskById);
//update a task by id
router.put('/:id', taskController.updateTaskById);
//delete a task by id
router.delete('/:id', taskController.deleteTaskById);
export default router;