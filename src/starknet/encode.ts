/* eslint-disable no-param-reassign */

/**
 * Some function imported from https://github.com/pedrouid/enc-utils/blob/master/src/index.ts
 * enc-utils is no dependency to avoid using `Buffer` which just works in node and no browsers
 */

export function removeHexPrefix(hex: string): string {
  return hex.replace(/^0x/, '');
}

export function addHexPrefix(hex: string): string {
  return `0x${removeHexPrefix(hex)}`;
}