import { Gpio } from 'pigpio';

import { ServoMotor } from './peripheries';


export type Servo = {
  gpio: Gpio,
  motor: ServoMotor,
};


export const setAngle = ({ motor, gpio }: Servo, angle: number) => {
  if (angle > motor.maxAngle || -1 * angle > motor.maxAngle) {
    throw new Error(`Angle out of bounds ${angle} ${motor.maxAngle}`);
  }

  const zeroAngle = angle + motor.maxAngle;
  const dutyCyclePercent = zeroAngle / (motor.maxAngle * 2);
  const dutyCycle =
    Math.floor(
      (motor.maxPulseWidth - motor.minPulseWidth)
        * dutyCyclePercent
        + motor.minPulseWidth
    );
  gpio.servoWrite(dutyCycle);
}


export const setupServo = (servo: Servo) =>
  servo.gpio.pwmFrequency(servo.motor.frequency);


export const createServo = (motor: ServoMotor, pin: number): Servo => {
  const gpio = new Gpio(pin, { mode: Gpio.OUTPUT });
  const servo = { gpio, motor };
  setupServo(servo);
  return servo;
};
