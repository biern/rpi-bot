import * as R from 'ramda';

import '../bot';
import { buildXpadStream, normalizeState, applyDeadzone } from 'src/xpad';


const run = async () => {
  buildXpadStream({
    onState: R.pipe(
      normalizeState,
      applyDeadzone(0.15),
      console.log,
    ),
    onQuit: () => process.exit(1),
  });
}


run().catch(console.error);
