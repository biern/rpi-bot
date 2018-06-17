import * as R from 'ramda';
import * as Rx from 'rxjs';
import { sampleTime, distinctUntilChanged, map, pairwise } from 'rxjs/operators';

import { XPadState, buildXpadStream, applyDeadzone } from './xpad';


export type SteeringEvents = {
  state: XPadState;
  events: Event[];
};


export type Event =
  {
    kind: 'button';
    id: string;
    value: boolean;
  } | {
    kind: 'axis';
    id: string;
    value: number;
  };


export const buildSteeringStream = (): Rx.Observable<SteeringEvents> => {
  const steeringSubject = new Rx.Subject<XPadState>();

  buildXpadStream({
    onState: (state) => steeringSubject.next(state),
    onQuit: () => process.exit(1),
  });

  const steeringStream: Rx.Observable<SteeringEvents> = steeringSubject.pipe(
    map(applyDeadzone(0.20)),
    distinctUntilChanged(R.equals),
    toEvents,
  );

  steeringStream.pipe(
    sampleTime(500),
  ).subscribe(({ events }) => console.log(events));

  return steeringStream.pipe(
    sampleTime(50),
  );
};


export const toEvents = (
  stateStream: Rx.Observable<XPadState>
): Rx.Observable<SteeringEvents> => {
  const getEvents = (previous: XPadState, current: XPadState) => {
    const axesEvents = R.reduce((events, [id, value]) => {
      if ((previous.axes as any)[id] !== value) {
        return R.append({ kind: 'axis', id, value }, events);
      }
      return events;
    }, [] as Event[], R.toPairs(current.axes));

    const buttonEvents = R.reduce((events, [id, value]) => {
      if ((previous.buttons as any)[id] !== value) {
        return R.append({ kind: 'button', id, value }, events);
      }
      return events;
    }, [] as Event[], R.toPairs(current.buttons));

    return axesEvents.concat(buttonEvents);
  }

  return stateStream.pipe(
    pairwise(),
    map(([previous, current]) => ({
      state: current,
      events: getEvents(previous, current),
    })),
  );
}
