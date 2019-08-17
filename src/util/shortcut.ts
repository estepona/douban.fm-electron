export const shortcuts = {
  pauseOrContinue: 'space',
  next: 'right',
  like: 'up',
  unlike: 'down',
  refresh: process.platform === 'win32' ? 'f5' : 'meta+r',
  setWindowOnTop: process.platform === 'win32' ? 'alt+f3' : 'meta+e',
  quit: process.platform === 'win32' ? 'alt+f4' : 'meta+q',
};
