'use strict';

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
    const enabledNames = new Set(enabled);
    for (const [name, value] of Object.entries(this.views)) {
      value.disabled = !enabledNames.has(name);
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
