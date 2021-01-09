'use strict';

import { Notification } from './notification.js';
import { Tabs } from './tabs.js';

import { Chip8 } from './emulator/chip8.js';
import { EmulatorView } from './emulator/emulatorview.js';
import { DisplayView } from './emulator/displayview.js';
import { RegistersView } from './emulator/registersview.js';
import { MemoryView } from './emulator/memoryview.js';
import { InstructionsView } from './emulator/instructionsview.js';

import { Chip8Compiler } from './compiler/chip8compiler.js';
import { CompilerView } from './compiler/compilerview.js';

const notification = new Notification('notification');
const tabs1 = new Tabs('tabs1', 'is-active');
const tabs2 = new Tabs('tabs2', 'is-active');

const chip8 = new Chip8();
new EmulatorView(chip8);
new DisplayView(chip8);
new RegistersView(chip8);
new MemoryView(chip8);
new InstructionsView(chip8);

const chip8compiler = new Chip8Compiler();
new CompilerView(chip8compiler, chip8, notification);
