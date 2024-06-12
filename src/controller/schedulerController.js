import { ObjectId } from 'mongodb';
import schedulerService from '../services/schedulerService.js';
import taskLogService from '../services/taskLogService.js';
import mqttClient from './mqttController.js';
import constant from '../constant.js';
import eventService from '../services/eventService.js';

const getAllTask = async (req, res) => {
  try {
    const scheduler = await schedulerService.getScheduler();
    res.status(200).json(scheduler);
  } catch (err) {
    res.status(500).json(err);
  }
}
const postTask = async (req, res) => {
  try {
    //check start time less than stop time
    if (parseInt(req.body.startTime) >= parseInt(req.body.stopTime)) {
      return res.status(400).json('Start time must be less than stop time');
    } 

    //check pumpIn
    if (req.body['pumpIn'] == '') return res.status(400).json('PumpIn must be filled');
    
    const ack = Date.now().toString();
    
    //set isActive to 1
    req.body['isActive'] = '1';

    //create new object id
    const taskID = new ObjectId();
    const newTask = req.body;
    newTask['_id'] = taskID;
    newTask['ack'] = ack;
    //send new task to mqtt
    mqttClient.publish(`${constant.HEADER_SERVER_SEND_TASK}:${JSON.stringify(newTask)}`);

    const onAckReceived = async () => {
      clearTimeout(timeout);
      // Call service to add task
      const savedTask = await schedulerService.addTask(req);
      // Call service to add task log
      await taskLogService.addTaskLog(savedTask._id);
      return res.status(200).json(savedTask);
    };

    //wait for ack from gateway
    const timeout = setTimeout(() => {
      //remove event receive ack
      eventService.mqttEvent.removeListener(`${constant.HEADER_GATEWAY_SEND_ACK}:${ack}`, onAckReceived);
      return res.status(404).json({ "result": "failed" });
    }, 3000)
    
    //add event receive ack
    eventService.mqttEvent.once(`${constant.HEADER_GATEWAY_SEND_ACK}:${ack}`, onAckReceived);
  } catch (err) {
    res.status(500).json(err);
  }
}
const getTaskByID = async (req, res) => {
  try {
    const task = await schedulerService.getTaskByID(req.params.taskID);
    if (!task) {
      return res.status(404).json('Task not found');
    }
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json(err);
  }
}
const updateTaskByID = async (req, res) => {
  try {
    const taskID = req.params.taskID;

    const ack = Date.now().toString();

    //check start time less than stop time
    if (parseInt(req.body.startTime) >= parseInt(req.body.stopTime)) {
      return res.status(400).json('Start time must be less than stop time');
    } 
    
    //check pumpIn
    if (req.body['pumpIn'] == '') return res.status(400).json('PumpIn must be filled');

    //call service to get task
    const task = await schedulerService.getTaskByID(taskID);
    if (!req.body['isActive']) {
      req.body['isActive'] = task.isActive;
    }
    //add id and ack to body
    req.body['ack'] = ack;
    req.body['_id'] = taskID;
    //send task to mqtt
    mqttClient.publish(`${constant.HEADER_SERVER_SEND_TASK}:${JSON.stringify(req.body)}`);

    const onAckReceived = async () => {
      clearTimeout(timeout);
      //update task to database
      const updatedTask = await schedulerService.updateTaskByID(taskID, req.body);
      return res.status(200).json(updatedTask);
    };

    //wait for ack from gateway
    const timeout = setTimeout(() => {
      //remove event receive ack
      eventService.mqttEvent.removeListener(`${constant.HEADER_GATEWAY_SEND_ACK}:${ack}`, onAckReceived);
      return res.status(404).json({ "result": "update failed" });
    }, 3000)
    
    //add event receive ack
    eventService.mqttEvent.once(`${constant.HEADER_GATEWAY_SEND_ACK}:${ack}`, onAckReceived);
  } catch (err) {
    res.status(500).json(err);
  }
}
const deleteTaskByID = async (req, res) => {
  try {
    const taskID = req.params.taskID;
    const ack = Date.now().toString();
  
    //send task to mqtt
    mqttClient.publish(`${constant.HEADER_SERVER_DELETE_TASK}:{"ack":"${ack}", "_id":"${taskID}"}`);

    const onAckReceived = async () => {
      clearTimeout(timeout);
      //call service delete task 
      await schedulerService.deleteTaskByID(taskID);
      //call service delete task log
      await taskLogService.deleteTaskLogByTaskID(taskID);
      return res.status(200).json('Task has been deleted');
    };

    //wait for ack from gateway
    const timeout = setTimeout(() => {
      //remove event receive ack
      eventService.mqttEvent.removeListener(`${constant.HEADER_GATEWAY_SEND_ACK}:${ack}`, onAckReceived);
      // return res.status(200).json('Task has been deleted');
      return res.status(404).json({ "result": "delete failed" });
    }, 3000)
    
    //add event receive ack
    eventService.mqttEvent.once(`${constant.HEADER_GATEWAY_SEND_ACK}:${ack}`, onAckReceived);
    
    
  } catch (err) {
    res.status(500).json(err);
  }
}

export default {
  getAllTask: getAllTask,
  postTask: postTask,
  getTaskByID: getTaskByID,
  updateTaskByID: updateTaskByID,
  deleteTaskByID: deleteTaskByID,
}