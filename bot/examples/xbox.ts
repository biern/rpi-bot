import * as R from 'ramda';

import { buildXpadStream, toXboxState, applyDeadzone } from 'src/xpad';


const run = async () => {
  buildXpadStream(
    R.pipe(
      toXboxState,
      applyDeadzone(0.15),
      console.log,
    ),
  );
}


run().catch(console.error);
