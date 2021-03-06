# CHIP-8 Compiler

This is a CHIP8 Compiler developed using JavaScript. It allows you to write code, compile, and see it in the emulator afterwards.

## Usage

![Compiler Screenshot](images/screenshot.png)

Click the `Compile` button to compile the code. Click `Start` or `Step` to run your code in the emulator. You can click `Stop` to stop the emulator, and you can click `Reset` to reset it. Clicking the `Save` button on the left will allow you to download the compiled binary file. 

## Language

Insturction names and descriptions are taked from [Cowgod's Chip-8 Technical Reference v1.0](http://devernay.free.fr/hacks/chip8/C8TECH10.HTM).

| Opcode | Instruction | Description |
|---|---|---|
| 0nnn | SYS addr | Jump to a machine code routine at nnn. |
| 00E0 | CLS | Clear the display. |
| 00EE | RET | Return from a subroutine. |
| 1nnn | JP addr | Jump to location nnn. |
| 2nnn | CALL addr | Call subroutine at nnn. |
| 3xkk | SE Vx, byte | Skip next instruction if Vx = kk. |
| 4xkk | SNE Vx, byte | Skip next instruction if Vx != kk. |
| 5xy0 | SE Vx, Vy | Skip next instruction if Vx = Vy. |
| 6xkk | LD Vx, byte | Set Vx = kk. |
| 7xkk | ADD Vx, byte | Set Vx = Vx + kk. |
| 8xy0 | LD Vx, Vy | Set Vx = Vy. |
| 8xy1 | OR Vx, Vy | Set Vx = Vx OR Vy. |
| 8xy2 | AND Vx, Vy | Set Vx = Vx AND Vy. |
| 8xy3 | XOR Vx, Vy | Set Vx = Vx XOR Vy. |
| 8xy4 | ADD Vx, Vy | Set Vx = Vx + Vy, set VF = carry. |
| 8xy5 | SUB Vx, Vy | Set Vx = Vx - Vy, set VF = NOT borrow. |
| 8xy6 | SHR Vx Vy | Set Vx = Vx SHR 1. |
| 8xy7 | SUBN Vx, Vy | Set Vx = Vy - Vx, set VF = NOT borrow. |
| 8xyE | SHL Vx Vy | Set Vx = Vx SHL 1. |
| 9xy0 | SNE Vx, Vy | Skip next instruction if Vx != Vy. |
| Annn | LD I, addr | Set I = nnn. |
| Bnnn | JP V0, addr | Jump to location nnn + V0. |
| Cxkk | RND Vx, byte | Set Vx = random byte AND kk. |
| Dxyn | DRW Vx, Vy, nibble | Display n-byte sprite starting at memory location I at (Vx, Vy), set VF = collision. |
| Ex9E | SKP Vx | Skip next instruction if key with the value of Vx is pressed. |
| ExA1 | SKNP Vx | Skip next instruction if key with the value of Vx is not pressed. |
| Fx07 | LD Vx, DT | Set Vx = delay timer value. |
| Fx0A | LD Vx, K | Wait for a key press, store the value of the key in Vx. |
| Fx15 | LD DT, Vx | Set delay timer = Vx. |
| Fx18 | LD ST, Vx | Set sound timer = Vx. |
| Fx1E | ADD I, Vx | Set I = I + Vx. |
| Fx29 | LD F, Vx | Set I = location of sprite for digit Vx. |
| Fx33 | LD B, Vx | Store BCD representation of Vx in memory locations I, I+1, and I+2. |
| Fx55 | LD I, Vx | Store registers V0 through Vx in memory starting at location I. |
| Fx65 | LD Vx, I | Read registers V0 through Vx from memory starting at location I. |


## Dependencies

- [Bulma CSS](https://bulma.io/)
- [Bulmaswatch Superhero](https://jenil.github.io/bulmaswatch/superhero/)

## Resources

- [CHIP-8 Emulator](https://github.com/cinar/Chip8EmulatorJS)
- [CHIP-8 Wikipedia](https://en.wikipedia.org/wiki/CHIP-8)
- [Cowgod's Chip-8 Technical Reference v1.0](http://devernay.free.fr/hacks/chip8/C8TECH10.HTM)

## License

The source code is provided under [MIT License](LICENSE).
