'use strict';

import { TokenName } from './tokenname.js';
import { Token } from './token.js';
import { TokenIterator } from './tokeniterator.js';
import { OpcodeBuffer } from './opcodebuffer.js';

/**
 * Program offset.
 */
const PROGRAM_OFFSET = 0x200;

/**
 * Parser pattern.
 */
const PATTERN =
  '(?:' +
  '(?:^(' +
  '(?:(?<section>[a-zA-Z_][a-zA-Z0-9_\\-]*):)' +
  '|(?<instruction>[A-Z]+)' +
  '))' +
  '|(?:[ \t]*(' +
  '(?:V(?<register>[0-9A-F]))' +
  '|(?:0x(?<hex>[0-9A-F]+))' +
  '|(?<name>[a-zA-Z_][a-zA-Z0-9_\\-]*)' +
  '|(?<other>.+)' +
  '))' +
  ')';

/**
 * CHIP 8 code compiler.
 * 
 * @author Onur Cinar
 */
export class Chip8Compiler {
  /**
   * Constructor.
   */
  constructor() {

  }

  /**
   * Parse text to tokens.
   * 
   * @param {string} text code text.
   * @return {Token[]} token list.
   */
  parse(text) {
    const re = new RegExp(PATTERN, 'gm');
    const tokens = [];

    while (re.lastIndex < text.length) {
      const match = re.exec(text);
      if (match === null) {
        break;
      }

      if (match.groups.section !== undefined) {
        tokens.push(new Token(TokenName.SECTION, match.groups.section));
      } else if (match.groups.instruction !== undefined) {
        tokens.push(new Token(TokenName.INSTRUCTION, match.groups.instruction));
      } else if (match.groups.register !== undefined) {
        tokens.push(new Token(TokenName.REGISTER, parseInt(match.groups.register, 16)));
      } else if (match.groups.hex !== undefined) {
        tokens.push(new Token(TokenName.HEX, parseInt(match.groups.hex, 16)));
      } else if (match.groups.name !== undefined) {
        tokens.push(new Token(TokenName.NAME, match.groups.name));
      } else if (match.groups.other !== undefined) {
        throw new Error(`Unable to parse ${match.groups.other}`);
      }
    }

    return tokens;
  }

  /**
   * Compile tokens to opcode.
   * 
   * @param {Token[]} tokens token list.
   * @return {Uint8Array} opcodes list.
   */
  compile(tokens) {
    const buffer = new OpcodeBuffer();
    const sections = {};

    const it = new TokenIterator(tokens);
    while (it.hasNext()) {
      const token = it.next();

      if (token.is(TokenName.SECTION)) {
        sections[token.value] = PROGRAM_OFFSET + buffer.byteLength;
      } else if (token.is(TokenName.HEX)) {
        buffer.putByte(token.asByte());
      } else if (token.is(TokenName.INSTRUCTION)) {
        if (token.value === 'CLS') {
          buffer.put(0x00E0);
        } else if (token.value === 'RET') {
          buffer.put(0x00EE);
        } else if (token.value === 'SYS') {
          this.putWithAddress(it, sections, 0x0000);
        } else if (token.value === 'JP') {
          this.compileJp(it, buffer, sections);
        } else if (token.value === 'CALL') {
          this.putWithAddress(it, sections, 0x2000);
        } else if (token.value === 'SE') {
          buffer.putWithRegisterXHexOrY(it, 0x3000, 0x5000);
        } else if (token.value === 'SNE') {
          buffer.putWithRegisterXHexOrY(it, 0x4000, 0x9000);
        } else if (token.value === 'LD') {
          this.compileLd(it, buffer, sections);
        } else if (token.value === 'ADD') {
          this.compileAdd(it, buffer);
        } else if (token.value === 'OR') {
          buffer.putWithRegisterXY(it, 0x8001);
        } else if (token.value === 'AND') {
          buffer.putWithRegisterXY(it, 0x8002);
        } else if (token.value === 'XOR') {
          buffer.putWithRegisterXY(it, 0x8003);
        } else if (token.value === 'SUB') {
          buffer.putWithRegisterXY(it, 0x8005);
        } else if (token.value === 'SHR') {
          buffer.putWithRegisterXY(it, 0x8006);
        } else if (token.value === 'SUBN') {
          buffer.putWithRegisterXY(it, 0x8007);
        } else if (token.value === 'SHL') {
          buffer.putWithRegisterXY(it, 0x800E);
        } else if (token.value === 'RND') {
          this.compileRnd(it, buffer);
        } else if (token.value === 'DRW') {
          this.compileDrw(it, buffer);
        } else if (token.value === 'SKP') {
          buffer.putWithRegisterX(it, 0xE09E);
        } else if (token.value === 'SKNP') {
          buffer.putWithRegisterX(it, 0xE0A1);
        } else {
          throw new Error(`Unknown ${token.value}`);
        }
      }
    }

    return buffer.save();
  }

  /**
   * Compile the JP instruction.
   * 
   * 1nnn - JP addr
   * Bnnn - JP V0, addr
   * 
   * @param {TokenIterator} it token iterator.
   * @param {OpcodeBuffer} buffer opcode buffer.
   * @param {Object} sections address list.
   */
  compileJp(it, buffer, sections) {
    const p1 = it.expect(TokenName.NAME, TokenName.HEX, TokenName.REGISTER);
    if (p1.is(TokenName.REGISTER)) {
      if (p1.asRegister() !== 0) {
        throw new Error(`Expecting V0 got ${p1.value}`);
      }
      const p2 = it.expect(TokenName.HEX);
      buffer.put(0xB000 | p2.asByte());
    } else {
      let address;
      if (p1.is(TokenName.NAME)) {
        address = sections[p1.value];
      } else {
        address = p1.asByte();
      }
      buffer.put(0x1000 | address);
    }
  }

  /**
   * Compile the LD instruction.
   * 
   * 6xkk - LD Vx, byte
   * 8xy0 - LD Vx, Vy
   * Annn - LD I, addr
   * Fx07 - LD Vx, DT
   * Fx0A - LD Vx, K
   * Fx15 - LD DT, Vx
   * Fx18 - LD ST, Vx
   * Fx29 - LD F, Vx
   * Fx33 - LD B, Vx
   * Fx55 - LD I, Vx
   * Fx65 - LD Vx, I
   * 
   * @param {TokenIterator} it token iterator.
   * @param {OpcodeBuffer} buffer opcode buffer.
   * @param {Object} sections address list.
   */
  compileLd(it, buffer, sections) {
    const p1 = it.expect(TokenName.REGISTER, TokenName.NAME);
    const p2 = it.expect(TokenName.HEX, TokenName.REGISTER, TokenName.NAME);

    if (p1.is(TokenName.REGISTER)) {
      if (p2.is(TokenName.HEX)) {
        buffer.put(0x6000 | p1.asRegisterX() | p2.asByte());
      } else if (p2.is(TokenName.REGISTER)) {
        buffer.put(0x8000 | p1.asRegisterX() | p2.asRegisterY());
      } else if (p2.value === 'DT') {
        buffer.put(0xF007 | p1.asRegisterX());
      } else if (p2.value === 'K') {
        buffer.put(0xF00A | p1.asRegisterX());
      } else if (p2.value === 'I') {
        buffer.put(0xF065 | p1.asRegisterX());
      } else {
        throw new Error(`Expected DT, K, I got ${p2.value}`);
      }
    } else {
      if (p1.value === 'I') {
        if (p2.is(TokenName.REGISTER)) {
          buffer.put(0xF055 | p2.asRegisterX());
        } else {
          let address;
          if (p2.is(TokenName.NAME)) {
            address = sections[p2.value];
          } else {
            address = p2.asAddress();
          }
          buffer.put(0xA000 | address);
        }
      } else if (p1.value === 'DT') {
        buffer.put(0xF015 | p2.asRegisterX());
      } else if (p1.value === 'ST') {
        buffer.put(0xF018 | p2.asRegisterX());
      } else if (p1.value === 'F') {
        buffer.put(0xF029 | p2.asRegisterX());
      } else if (p1.value === 'B') {
        buffer.put(0xF033 | p2.asRegisterX());
      } else {
        throw new Error(`Expected I, DT, ST, F, B got ${p1.value}`);
      }
    }
  }

  /**
   * Compile the ADD instruction.
   * 
   * 7xkk - ADD Vx, byte
   * 8xy4 - ADD Vx, Vy
   * Fx1E - ADD I, Vx
   * 
   * @param {TokenIterator} it token iterator.
   * @param {OpcodeBuffer} buffer opcode buffer.
   */
  compileAdd(it, buffer) {
    const p1 = it.expect(TokenName.NAME, TokenName.REGISTER);
    if (p1.is(TokenName.NAME)) {
      if (p1.value !== 'I') {
        throw new Error(`Expecting I got ${p1.value}`);
      }

      const p2 = it.expect(TokenName.REGISTER);
      buffer.put(0xF01E | p2.asRegisterX());
    } else {
      const p2 = it.expect(TokenName.HEX, TokenName.REGISTER);
      if (p2.is(TokenName.HEX)) {
        buffer.put(0x7000 | p1.asRegisterX() | p2.asByte());
      } else {
        buffer.put(0x8004 | p1.asRegisterX() | p2.asRegisterY());
      }
    }
  }

  /**
   * Compile the RND instruction.
   * 
   * Cxkk - RND Vx, byte
   * 
   * @param {TokenIterator} it token iterator.
   * @param {OpcodeBuffer} buffer opcode buffer.
   */
  compileRnd(it, buffer) {
    const p1 = it.expect(TokenName.REGISTER);
    const p2 = it.expect(TokenName.HEX);
    buffer.put(0xC000 | p1.asRegisterX() | p2.asByte());
  }

  /**
   * Compile the DRW instruction.
   * 
   * Dxyn - DRW Vx, Vy, nibble
   * 
   * @param {TokenIterator} it token iterator.
   * @param {OpcodeBuffer} buffer opcode buffer.
   */
  compileDrw(it, buffer) {
    const p1 = it.expect(TokenName.REGISTER);
    const p2 = it.expect(TokenName.REGISTER);
    const p3 = it.expect(TokenName.HEX);
    buffer.put(0xD000 | p1.asRegisterX() | p2.asRegisterY() | p3.asByte());
  }
}
