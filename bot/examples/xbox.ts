import * as R from 'ramda';

import { buildXpadStream, toXboxState, applyDeadzone } from 'src/xpad';


const run = async () => {
  buildXpadStream({
    onState: R.pipe(
      toXboxState,
      applyDeadzone(0.15),
      console.log,
    ),
    onQuit: () => process.exit(1),
  });
}


run().catch(console.error);
