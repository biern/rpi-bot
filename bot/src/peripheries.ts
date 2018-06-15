export type ServoMotor = {
  minPulseWidth: number;
  maxPulseWidth: number;
  frequency: number;
  maxAngle: number;
}


export const towerPro: ServoMotor = {
  minPulseWidth: 500,
  maxPulseWidth: 2200,
  frequency: 50,
  maxAngle: 90,
};


export const hd1800a: ServoMotor = {
  minPulseWidth: 600,
  maxPulseWidth: 2500,
  frequency: 50,
  maxAngle: 90,
};
