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
      {
        id: 'save',
        run: () => {
          self.save();
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
   * Compile editor.
   */
  compile() {
    try {
      this.enable([]);

      const tokens = this.chip8compiler.parse(this.editor.innerText);
      console.log(tokens);

      this.rom = this.chip8compiler.compile(tokens);
      this.chip8.reset();
      this.chip8.loadProgramFromBytes(this.rom);

      this.notification.success('Compiled.');
      this.enable(['compile', 'save']);
    } catch (e) {
      this.notification.error(e);
      this.enable(['compile']);
    }
  }

  /**
   * Save compiled rom image.
   */
  save() {
    if (this.rom === undefined) {
      return;
    }

    const blob = new Blob([this.rom], { type: 'octet/stream' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'chip8.rom';
    a.click();

    setTimeout(() => {
      window.URL.revokeObjectURL(url);
      a.remove();
    }, 10 * 1000);
  }
}
