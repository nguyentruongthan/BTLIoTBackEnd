import model from '../model/model.js';

const getAllTask = async (req, res) => {
  try {
    const tasks = await model.Task.find();
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json(err);
  }
}
const postTask = async (req, res) => {
  try {
    //send req to mqtt
    //vô subscribe
    const newTask = new model.Task(req.body);
    const savedTask = await newTask.save();
    res.status(200).json(savedTask);
  } catch (err) {
    res.status(500).json(err);
  }
}
const getTaskById = async (req, res) => {
  try {
    const task = await model.Task.findById(req.params.id);
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json(err);
  }
}
const updateTaskById = async (req, res) => {
  try {
    const task = await model.Task.findById(req.params.id);
    await task.updateOne({ $set: req.body });
    res.status(200).json('The task has been updated');
  } catch (err) {
    res.status(500).json(err);
  }
}
const deleteTaskById = async (req, res) => {
  try {
    await model.Task.deleteOne({ _id: req.params.id });
  } catch (err) {
    res.status(500).json(err);
  }
}

export default {
  getAllTask: getAllTask,
  postTask: postTask,
  getTaskById: getTaskById,
  updateTaskById: updateTaskById,
  deleteTaskById: deleteTaskById,
}