'use strict';

import { DisplayView } from './displayview.js';
import { KeyboardView } from './keyboardview.js';
import { RegistersView } from './registersview.js';
import { MemoryView } from './memoryview.js';
import { InstructionsView } from './instructionsview.js';

/**
 * Emulator view.
 *
 * @author Onur Cinar
 */
export class EmulatorView {
  /**
   * Constructor.
   *
   * @param {Chip8} chip8 chip8 instance.
   */
  constructor(chip8) {
    this.chip8 = chip8;
    this.views = {};

    this.initButtons();
    this.enable(['start', 'step']);

    new DisplayView(chip8);
    new KeyboardView(chip8);
    new RegistersView(chip8);
    new MemoryView(chip8);
    new InstructionsView(chip8);
  }

  /**
   * Initializes the control buttons.
   */
  initButtons() {
    const self = this;
    const actions = [
      {
        id: 'start',
        run: () => {
          self.start();
        },
      },
      {
        id: 'stop',
        run: () => {
          self.stop();
        },
      },
      {
        id: 'step',
        run: () => {
          self.step();
        },
      },
      {
        id: 'reset',
        run: () => {
          self.reset();
        },
      },
    ];

    for (let action of actions) {
      const a = document.getElementById(action.id);
      a.addEventListener('click', action.run);
      this.views[action.id] = a;
    }
  }

  /**
   * Enable given list of views and disable the other ones.
   *
   * @param {Array} enabled enabled names.
   */
  enable(enabled) {
    const enabledIds = new Set(enabled);
    for (const [id, value] of Object.entries(this.views)) {
      value.disabled = !enabledIds.has(id);
    }
  }

  /**
   * Starts emulator.
   */
  start() {
    this.chip8.start();
    this.enable(['stop']);
  }

  /**
   * Stops emulator.
   */
  stop() {
    this.chip8.stop();
    this.enable(['start', 'step', 'reset']);
  }

  /**
   * Steps to next instruction.
   */
  step() {
    this.chip8.step();
  }

  /**
   * Resets emulator.
   */
  reset() {
    this.chip8.reset();
    this.enable(['start', 'step']);
  }
}
