import chalk from 'chalk';

const COLORS = ["red", "green", "blue"] as const;

type Color = typeof COLORS[number];

type LogFn = {
  (msg: string): void;
} & {
  [K in Color]: (msg: string) => void;
};

const baseLog = (msg: string) => console.log(msg);

export const log = COLORS.reduce((acc, color) => {
  acc[color] = (msg: string) => console.log(chalk[color](msg));
  return acc;
}, baseLog as LogFn);