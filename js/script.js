import { Chip8Compiler } from './chip8compiler.js';
import { Notification } from './notification.js';

const chip8compiler = new Chip8Compiler();

const compileButton = document.getElementById('compile');
const editor = document.getElementById('editor');

const notification = new Notification('notification');

compileButton.addEventListener('click', (event) => {
  try {
    const tokens = chip8compiler.parse(editor.innerText);
    console.log(tokens);

    chip8compiler.compile(tokens);

    notification.success('Compiled.');
  } catch (e) {
    notification.error(e);
  }
});
