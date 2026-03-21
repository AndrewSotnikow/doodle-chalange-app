import { randomUUID } from 'crypto';

import { Message } from '../types/types.js';

const timeUnits: Record<string, number> = {
  h: 3600000,
  m: 60000,
  s: 1000,
};

/**
 * Converts a human readable time string to milliseconds.
 */
export const timeToMilliseconds = (timeStr: string): number => {
  return timeStr.split(' ').reduce((total, part) => {
    const unit = part.slice(-1);
    const value = parseInt(part.slice(0, -1), 10);
    return total + value * (timeUnits[unit] ?? 0);
  }, 0);
};

const INITIAL_MESSAGES: Message[] = [
  {
    _id: randomUUID(),
    message: 'Hey team! I created a Doodle poll for our monthly team lunch 🍕',
    author: 'Luka',
    createdAt: new Date(
      Date.now() - timeToMilliseconds('5h 12m 30s')
    ).toISOString(),
  },
  {
    _id: randomUUID(),
    message: 'Cool! It&#39;s super easy to vote.',
    author: 'John',
    createdAt: new Date(
      Date.now() - timeToMilliseconds('4h 10m')
    ).toISOString(),
  },
  {
    _id: randomUUID(),
    message:
      'Could everyone vote by tomorrow? Then we can lock in the restaurant reservation.',
    author: 'Luka',
    createdAt: new Date(
      Date.now() - timeToMilliseconds('3h 7m 30s')
    ).toISOString(),
  },
  {
    _id: randomUUID(),
    message: "Done! Love how it shows everyone's availability at a glance.",
    author: 'Maddie',
    createdAt: new Date(Date.now() - timeToMilliseconds('2h 5m')).toISOString(),
  },
  {
    _id: randomUUID(),
    message: "Just submitted my preferences. Can't wait for the lunch! 😋",
    author: 'Nina',
    createdAt: new Date(
      Date.now() - timeToMilliseconds('1h 2m 30s')
    ).toISOString(),
  },
] as const;

export { INITIAL_MESSAGES };
