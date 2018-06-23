import * as R from 'ramda';

import { DCController } from "./dc";
import { Servo, setAngle } from "./servo";
import { Event } from "./stream";


export const setMultiAxesDCPower = (
  controls: DCController,
  forwardAxis: number,
  backwardAxis: number,
) => {
  if (backwardAxis > 0) {
    controls.setPower(backwardAxis, -1);
  } else {
    controls.setPower(forwardAxis, 1);
  }
};


export const servoSwitch = (
  servo: Servo,
  angles: { [P in Event['id']]: number },
) => (event: Event) => {
  if (event.value) {
    R.forEachObjIndexed((angle, id) => {
      if (id === event.id) {
        setAngle(servo, angle);
      }
    }, angles);
  }
};
