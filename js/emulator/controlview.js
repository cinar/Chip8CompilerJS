'use strict';

/**
 * Control view. Machine controls.
 *
 * @author Onur Cinar
 */
export class ControlView {
  /**
   * Constructor.
   *
   * @param {Chip8} chip8 chip8 instance.
   */
  constructor(chip8) {
    this.chip8 = chip8;
    this.controls = document.getElementById('controls');
    this.views = {};

    this.initButtons();
    this.enable(['Start', 'Step']);
  }

  /**
   * Initializes the control buttons.
   */
  initButtons() {
    const self = this;
    const actions = [
      {
        name: 'Start',
        run: () => {
          self.start();
        },
      },
      {
        name: 'Stop',
        run: () => {
          self.stop();
        },
      },
      {
        name: 'Step',
        run: () => {
          self.step();
        },
      },
      {
        name: 'Reset',
        run: () => {
          self.reset();
        },
      },
    ];

    for (let i = 0; i < actions.length; i++) {
      const action = actions[i];

      const button = document.createElement('button');
      button.innerText = action.name;
      button.addEventListener('click', action.run);
      this.controls.appendChild(button);
      this.views[action.name] = button;
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
    this.enable(['Stop']);
  }

  /**
   * Stops emulator.
   */
  stop() {
    this.chip8.stop();
    this.enable(['Start', 'Step', 'Reset']);
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
    this.enable([]);
  }
}
