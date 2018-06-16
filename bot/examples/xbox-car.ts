import * as R from 'ramda';

import '../bot';
import { buildXpadStream, toXboxState, applyDeadzone, XPadState } from 'src/xpad';
import { towerPro, dc50hz } from 'src/peripheries';
import { createServo, setAngle } from 'src/servo';
import { createABController } from 'src/dc';
import { setMultiAxesDCPower } from 'src/controls';


const steeringServo = createServo(towerPro, 18);


const mainMotor = createABController(dc50hz, {a: 13, b: 6, pwm: 5})


const steer = (state: XPadState) => {
  setAngle(steeringServo, state.axes['0'] * 90);
  setMultiAxesDCPower(mainMotor, state.axes["5"], state.axes["2"]);
};


const run = async () => {
  buildXpadStream({
    onState: R.pipe(
      toXboxState,
      applyDeadzone(0.15),
      steer,
    ),
    onQuit: () => process.exit(1),
  });
}


run().catch(console.error);
