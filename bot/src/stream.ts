import * as R from 'ramda';
import * as Rx from 'rxjs';
import { sampleTime, distinct, distinctUntilChanged, map } from 'rxjs/operators';
import { XPadState, buildXpadStream, applyDeadzone } from './xpad';


export const buildSteeringStream = (): Rx.Observable<XPadState> => {
  const steeringSubject = new Rx.Subject<XPadState>();

  buildXpadStream({
    onState: (state) => steeringSubject.next(state),
    onQuit: () => process.exit(1),
  });

  const steeringStream = steeringSubject.pipe(
    map(applyDeadzone(0.20)),
    distinctUntilChanged(R.equals),
  );

  steeringStream.pipe(
    sampleTime(500),
  ).subscribe(console.log);

  return steeringStream.pipe(
    sampleTime(50),
  );
};
