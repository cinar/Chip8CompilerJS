'use strict';

import { TokenName } from './tokenname.js';
import { Token } from './token.js';

/**
 * Token iterator.
 * 
 * @author Onur Cinar
 */
export class TokenIterator {
  /**
   * Constructor.
   * 
   * @param {Token[]} tokens token list.
   */
  constructor(tokens) {
    this.tokens = tokens;
    this.index = -1;
  }

  /**
   * Has next.
   * 
   * @return {boolean} has next.
   */
  hasNext() {
    return (this.index + 1) < this.tokens.length;
  }

  /**
   * Next token.
   */
  next() {
    if (!this.hasNext()) {
      throw new Error('No tokens.');
    }
    this.index++;
    return this.tokens[this.index];
  }

  /**
   * Expect token with any of the given names.
   * 
   * @param {TokenName} names token names.
   * @return {Token} token object.
   */
  expect(...names) {
    const token = this.next();
    for (let name of names) {
      if (token.name === name) {
        return token;
      }
    }

    throw new Error(`Expecting ${names} got ${token.name}`);
  }
}
