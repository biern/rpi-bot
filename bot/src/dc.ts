import { Gpio } from 'pigpio';


import { DCMotor } from "./peripheries";


type Direction = 1 | -1


export interface DCController {
  setPower(power: number, direction: Direction): void;
}



export class ABController implements DCController {
  constructor(
    readonly motor: DCMotor,
    readonly gpio: { a: Gpio, b: Gpio, pwm: Gpio },
  ) {}

  setPower(power: number, direction: Direction) {
    if (direction === 1) {
      this.gpio.a.digitalWrite(1);
      this.gpio.b.digitalWrite(0);
    } else {
      this.gpio.a.digitalWrite(0);
      this.gpio.b.digitalWrite(1);
    }

    this.gpio.pwm.pwmWrite(Math.floor(power * 255));
  }
}


export const createABController = (
  motor: DCMotor,
  pins: { a: number, b: number, pwm: number },
) => {
  const gpio = {
    a: new Gpio(pins.a, { mode: Gpio.OUTPUT }),
    b: new Gpio(pins.b, { mode: Gpio.OUTPUT }),
    pwm: new Gpio(pins.pwm, { mode: Gpio.OUTPUT }),
  };

  gpio.pwm.pwmFrequency(motor.frequency);
  return new ABController(motor, gpio);
};
