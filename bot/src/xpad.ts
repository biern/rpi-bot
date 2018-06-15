import * as R from 'ramda';


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
    .split('  ')
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
