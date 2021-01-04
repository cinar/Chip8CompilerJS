'use strict';

import { TokenName } from './tokenname.js';
import { Token } from './token.js';
import { TokenIterator } from './tokeniterator.js';

/**
 * Opcode buffer.
 * 
 * @author Onur Cinar
 */
export class OpcodeBuffer {
  /**
   * Constructor.
   */
  constructor() {
    this.buffer = new ArrayBuffer(4096);
    this.view = new DataView(this.buffer);
    this.byteIndex = 0;
  }

  /**
   * Gets the byte length.
   * 
   * @return {number} byte length.
   */
  get byteLength() {
    return this.byteIndex;
  }

  /**
   * Save opcodes.
   * 
   * @return {Uint8Array} opcode list.
   */
  save() {
    return new Uint8Array(this.buffer, 0, this.byteLength);
  }

  /**
   * Put byte.
   * 
   * @param {number} value byte value.
   */
  putByte(value) {
    this.view.setUint8(this.byteIndex, value);
    this.byteIndex++;
  }

  /**
   * Put instruction.
   * 
   * @param {number} value instruction value.
   */
  put(value) {
    this.view.setUint16(this.byteIndex, value, false);
    this.byteIndex += 2;
  }

  /**
   * Put instruction with address.
   * 
   * @param {TokenIterator} it token iterator.
   * @param {Object} sections address list.
   * @param {number} opcode opcode value.
   */
  putWithAddress(it, sections, opcode) {
    const p1 = it.expect(TokenName.NAME, TokenName.HEX);
    let address;

    if (p1.is(TokenName.NAME)) {
      address = sections[p1.value];
    } else {
      address = p1.asAddress();
    }

    this.put(opcode | address);
  }

  /**
   * Put instruction with the register X.
   * 
   * @param {TokenIterator} it token iterator.
   * @param {number} opcode opcode value.
   */
  putWithRegisterX(it, opcode) {
    const p1 = it.expect(TokenName.REGISTER);
    this.put(opcode | p1.asRegisterX());
  }

  /**
   * Put instruction with register X and register Y.
   * 
   * @param {TokenIterator} it token iterator.
   * @param {number} opcode opcode value.
   */
  putWithRegisterXY(it, opcode) {
    const p1 = it.expect(TokenName.REGISTER);
    const p2 = it.expect(TokenNane.REGISTER);
    this.put(opcode | p1.asRegisterX() | p2.asRegisterY());
  }

  /**
   * Put insturction with register X and hex or register Y.
   * 
   * @param {TokenIterator} it token iterator.
   * @param {number} opcodeWithHex opcode with hex value.
   * @param {number} opcodeWithRegister opcode with register value.
   */
  putWithRegisterXHexOrY(it, opcodeWithHex, opcodeWithRegister) {
    const p1 = it.expect(TokenName.REGISTER);
    const p2 = it.expect(TokenName.HEX, TokenName.REGISTER);
    if (p2.is(TokenName.HEX)) {
      this.put(opcodeWithHex | p1.asRegisterX() | p2.asByte());
    } else {
      this.put(opcodeWithRegister | p1.asRegisterX() | p2.asRegisterY());
    }
  }
}
