import model from '../model/model.js';

const getScheduler = async () => {
  const scheduler = await model.Task.find();
  return scheduler;
}

export default {
  getScheduler: getScheduler,
}