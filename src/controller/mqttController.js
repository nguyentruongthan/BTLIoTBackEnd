import mqtt from 'mqtt';
import schedulerService from '../services/schedulerService.js';
import constant from '../constant.js';
import 'dotenv/config';
import eventService from '../services/eventService.js';
import sensorLogService from '../services/sensorLogService.js';
import taskLogService from '../services/taskLogService.js';
class MQTTClient {
  publish(message) {
    if (!this.client || !this.client.connected) {
      console.error("Client is not initialized or not connected.");
      return;
    }
    this.client.publish(`${process.env.MQTT_USERNAME}/feeds/${process.env.MQTT_TOPIC}`, message);
  }

  constructor(brokerUrl) {
    console.log('init MQTT');
    console.log(process.env.MQTT_PASSWORD);
    this.client = mqtt.connect(brokerUrl, {
      username: process.env.MQTT_USERNAME,
      password: process.env.MQTT_PASSWORD,
    });

    this.client.on('connect', () => {
      console.log('Connected to MQTT Broker');
      //subscribe to topic
      this.client.subscribe(`${process.env.MQTT_USERNAME}/feeds/${process.env.MQTT_TOPIC}`, (err) => {
        if (err) {
          console.log(err);
        }
      })
    });

    this.client.on('message', async (topic, message) => {
      let username = topic.split('/')[2];

      message = message.toString();
      console.log(`Received message from ${topic}: ${message.toString()}`);
      // Xử lý dữ liệu nhận được tại đây
      let splitMessage = message.toString().split(':');

      const header = parseInt(splitMessage[0]);
      switch (header) {
        case constant.HEADER_GETWAY_REQUEST_TASK: // receive request for get all scheduler from iot gatweway
          const scheduler = await schedulerService.getScheduler();
          scheduler.forEach((task) => {
            this.publish(`1:${JSON.stringify(task)}`);
          });
          break;
        case constant.HEADER_GATEWAY_SEND_ACK:
          console.log('ACK from gateway: ', message);
          //add event to eventService
          eventService.mqttEvent.emit(message, "");
          break;
        case constant.HEADER_GATEWAY_SEND_SENSOR_VALUE:
          const tempValue = splitMessage[1];
          const humiAirValue = splitMessage[2];
          await sensorLogService.addSensorLog(
            { tempValue: tempValue, humiAirValue: humiAirValue });
          break;
        case constant.HEADER_GATEWAY_SEND_TASK_STATUS:
          const taskID = splitMessage[1];
          const key = splitMessage[2];
          const value = splitMessage[3];
          console.log(taskID);
          console.log(key);
          console.log(value);
          await taskLogService.updateTaskLog(taskID, key, value);
      }
      
    });

    this.client.on('close', () => {
      console.log('Connection to MQTT Broker closed');
    });
  }
}

const brokerUrl = 'mqtt://io.adafruit.com';
const mqttClient = new MQTTClient(brokerUrl);

export default mqttClient;

