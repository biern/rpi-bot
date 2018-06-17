import * as R from 'ramda';

import '../bot';
import { XPadState } from 'src/xpad';
import { towerPro, dc50hz } from 'src/peripheries';
import { createServo, setAngle } from 'src/servo';
import { createABController } from 'src/dc';
import { setMultiAxesDCPower } from 'src/controls';
import { buildSteeringStream } from 'src/stream';


const steeringServo = createServo(towerPro, 18);


const mainMotor = createABController(dc50hz, {a: 13, b: 6, pwm: 5})


const steer = (state: XPadState) => {
  setAngle(steeringServo, state.axes['0'] * 90);
  setMultiAxesDCPower(mainMotor, state.axes["5"], state.axes["2"]);
};


const run = async () => {
  buildSteeringStream().subscribe(steer);
}


run().catch(console.error);
