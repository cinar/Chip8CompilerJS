'use strict';

/**
 * Compiler view.
 *
 * @author Onur Cinar
 */
export class CompilerView {
  /**
   * Constructor.
   *
   * @param {Chip8Compiler} chip8Compiler chip8 compiler.
   * @param {Chip8} chip8 chip8 compiler.
   * @param {Notification} notification notification instance.
   */
  constructor(chip8compiler, chip8, notification) {
    this.chip8compiler = chip8compiler;
    this.chip8 = chip8;
    this.notification = notification;
    this.views = {};
    this.editor = document.getElementById('editor');

    this.initButtons();
    this.enable(['compile']);
  }

  /**
   * Initializes the control buttons.
   */
  initButtons() {
    const self = this;
    const actions = [
      {
        id: 'compile',
        run: () => {
          self.compile();
        },
      },
    ];

    for (let action of actions) {
      const a = document.getElementById(action.id);
      a.addEventListener('click', action.run);
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
   * Compile editor.
   */
  compile() {
    try {
      const tokens = this.chip8compiler.parse(this.editor.innerText);
      console.log(tokens);

      const bytes = this.chip8compiler.compile(tokens);
      this.chip8.loadProgramFromBytes(bytes);

      this.notification.success('Compiled.');
    } catch (e) {
      this.notification.error(e);
    }
  }
}
