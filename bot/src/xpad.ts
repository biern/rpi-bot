import * as readline from 'readline';
import * as R from 'ramda';
import { spawn } from 'child_process';


export type XPadState = {
  axes: {
    0: number;
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
    6: number;
    7: number;
  },
  buttons: {
    0: boolean;
    1: boolean;
    2: boolean;
    3: boolean;
    4: boolean;
    5: boolean;
    6: boolean;
    7: boolean;
    8: boolean;
    9: boolean;
    10: boolean;
    11: boolean;
    12: boolean;
  },
};


export const findAll = (needle: RegExp, haystack: string) => {
  const results = [];
  const regex = new RegExp(needle, 'gi');
  let result;
  while ( (result = regex.exec(haystack)) ) {
    results.push(result[0]);
  }
  return results;
}


export const parseState = (state: string): XPadState => {
  const [axesString, buttonsString] = state.split('Axes:')[1].split('Buttons:');
  const buttonPairs =
    buttonsString
    .trim()
    .split(' ')
    .filter((v) => v.trim())
    .map((pair) => pair.split(':'))
    .map(([key, value]) => [key, value === 'on']) as [keyof XPadState['buttons'], boolean][];

  const axesPairs =
    findAll(/\d+\:\s*-?\d+/, axesString.trim())
    .map((pair) => pair.split(':'))
    .map(([key, value]) => [key.trim(), parseInt(value)]) as [keyof XPadState['axes'], number][];
  ;

  return {
    axes: R.fromPairs(axesPairs),
    buttons: R.fromPairs(buttonPairs),
  } as XPadState;
};


export const normalizeState = (state: XPadState): XPadState => {
  return R.pipe<XPadState, XPadState, XPadState>(
    R.evolve({
      axes: R.map((value: number) => value / 32767) as any,
    }),
    R.evolve({
      axes: {
        2: (v: number) => v / 2 + 0.5,
        5: (v: number) => v / 2 + 0.5,
      }
    }),
  )(state);
};


export const applyDeadzone = (deadzone: number) => (state: XPadState): XPadState =>
  R.evolve({
    axes: R.map(
      (value: number) => {
        if (value > 0) {
          return R.max(0, value - deadzone) / (1 - deadzone);
        } else {
          return R.min(0, value + deadzone) / (1 - deadzone);
        }
      },
    ) as any,
  }, state)


export const buildXpadStream = (callbacks: {
  onState: (state: XPadState) => void,
  onQuit: () => void,
}) => {
  const stream = spawn('jstest', ['--normal', '/dev/input/js0'])

  stream.on('exit', () => {
    console.error('jstest process exited');
    callbacks.onQuit();
  });

  let line = '';

  stream.stdout.on('data', (data: Buffer) => {
    const text = data.toString();
    line += text;
    if (line.length >= 200) {

      const state = R.tryCatch(parseState, R.always(undefined))(line);
      if (state) {
        callbacks.onState(normalizeState(state));
      } else {
        if (line.search('error') >= 0) {
          console.error(line)
        }
      }

      line = '';
    }
  });
};
