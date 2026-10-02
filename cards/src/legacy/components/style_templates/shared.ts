import {Easing, interpolate} from 'remotion';

export const ease = (
  frame: number,
  input: [number, number],
  output: [number, number],
) =>
  interpolate(frame, input, output, {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

export const softShadow = '0 30px 80px rgba(15,23,42,0.14)';
