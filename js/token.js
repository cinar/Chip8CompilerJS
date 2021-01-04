import { TokenName } from './tokenname.js';

/**
 * Token object.
 * 
 * @author Onur Cinar
 */
export class Token {
  /**
   * Constructor.
   * 
   * @param {TokenName} name token name.
   * @param {any} value token value.
   */
  constructor(name, value) {
    this.name = name;
    this.value = value;
  }

  /**
   * Is name.
   * 
   * @param {TokenName} name token name.
   * @return {boolean} is name.
   */
  is(name) {
    return this.name === name;
  }

  /**
   * Gets the token value as byte.
   * 
   * @return {number} token value as byte.
   */
  asByte() {
    return this.value & 0xFF;
  }

  /**
   * Gets the token value as address.
   * 
   * @return {number} token value as address.
   */
  asAddress() {
    return this.value & 0xFFF;
  }

  /**
   * Gets the token value as register.
   * 
   * @return {number} token value as register.
   */
  asRegister() {
    return this.value & 0xF;
  }

  /**
   * Gets as register X.
   * 
   * @return {number} register X.
   */
  asRegisterX() {
    return this.asRegister() << 8;
  }

  /**
   * Gets as register Y.
   * 
   * @return {number} register Y.
   */
  asRegisterY() {
    return this.asRegister() << 4;
  }
}
