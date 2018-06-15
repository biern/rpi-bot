import * as R from 'ramda';
import { assert } from 'chai';
import { parseState, XPadState } from './xpad';


const neutralString = 'Axes:  0:     0  1:     0  2:     0  3:     0  4:     0  5:     0  6:     0  7:     0 Buttons:  0:off  1:off  2:off  3:off  4:off  5:off  6:off  7:off  8:off  9:off  10:off  11:off  12:off '


const neutralState: XPadState = {
  axes: {
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
  },
  buttons: {
    0: false,
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
    7: false,
    8: false,
    9: false,
    10: false,
    11: false,
    12: false,
  },
};


context('Xpad', () => {
  it('Parses neutral state', () => {
    assert.deepEqual(
      parseState(neutralString),
      neutralState,
    );
  });

  it('Parses A pressed', () => {
    assert.deepEqual(
      parseState(neutralString.replace(' 0:off', ' 0:on')),
      R.mergeDeepRight(neutralState, { buttons: { 0: true }}),
    );
  });

  it('Parses axes value', () => {
    assert.deepEqual(
      parseState(neutralString.replace(' 1:     0', ' 1:     15')),
      R.mergeDeepRight(neutralState, { axes: { 1: 15 }}),
    );
  });
});
