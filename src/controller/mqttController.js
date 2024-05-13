import mqtt from 'mqtt';
import schedulerService from '../services/schedulerService.js';
import 'dotenv/config';

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
        case 0: 
          const scheduler = await schedulerService.getScheduler();
          scheduler.forEach((task) => {
            this.publish(`1:${JSON.stringify(task)}`);
          });
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

