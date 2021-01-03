/**
 * Parser pattern.
 */
const PATTERN = 
  '(?:' +
    '(?:^(' +
      '(?:(?<section>[a-z_][a-z0-9_\\-]*):)' +
      '|(?<instruction>[a-z]+)' +
    '))' +
    '|(?:[ \t]*(' +
      '(?:v(?<register>[0-9a-f]))' +
      '|(?:0x(?<hex>[0-9a-f]+))' +
      '|(?<name>[a-z_][a-z0-9_\\-]*)' +
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
   * @return {[{name: string, value: any}]} token list.
   */
  parse(text) {
    const re = new RegExp(PATTERN, 'igm');
    const tokens = [];

    while (re.lastIndex < text.length) {
      const match = re.exec(text);
      if (match === null) {
        break;
      }

      if (match.groups.section !== undefined) {
        tokens.push({
          name: 'SECTION',
          value: match.groups.section
        });
      } else if (match.groups.instruction !== undefined) {
        tokens.push({
          name: 'INSTRUCTION',
          value: match.groups.instruction
        });
      } else if (match.groups.register !== undefined) {
        tokens.push({
          name: 'REGISTER',
          value: parseInt(match.groups.register, 16)
        });
      } else if (match.groups.hex !== undefined) {
        tokens.push({
          name: 'HEX',
          value: parseInt(match.groups.hex, 16)
        });
      } else if (match.groups.name !== undefined) {
        tokens.push({
          name: 'NAME',
          value: match.groups.name
        });
      } else if (match.groups.other !== undefined) {
        throw new Error(`Unable to parse ${match.groups.other}`);
      }
    }

    return tokens;
  }
}
