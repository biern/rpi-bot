import { Gpio } from 'pigpio';

import { towerPro, hd1800a } from 'src/peripheries';
import { Servo, setupServo, setAngle } from 'src/servo';


const someServo = {
  motor: hd1800a,
  gpio: new Gpio(18, {mode: Gpio.OUTPUT}),
}


const run = async () => {
  const servo = someServo;

  setupServo(servo);

  setAngle(servo, -90);
  await wait(2000);
  setAngle(servo, 0);
  await wait(2000);
  setAngle(servo, 90);
  await wait(2000);
}


const wait = (t: number) => new Promise(resolve => setTimeout(resolve, t))


run().catch(console.error);
