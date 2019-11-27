const { ipcRenderer, shell } = require('electron');

const checkUpdateResult = document.getElementById('checkUpdateResult');
const latestVersionLink = document.getElementById('latestVersionLink');
const closeButton = document.getElementById('checkUpdateCloseButton');

/**
 * event listeners
 */
closeButton.addEventListener('click', e => {
  e.preventDefault();

  ipcRenderer.send('checkUpdate:close');
});

latestVersionLink.addEventListener('click', e => {
  e.preventDefault();

  shell.openExternal(latestVersionLink.href);
});

/**
 * ipc
 */
ipcRenderer.on('checkUpdate:result', (event, val) => {
  checkUpdateResult.innerText = val[0];

  if (val.length === 3) {
    checkUpdateResult.innerText += ': ';
    latestVersionLink.innerText = val[1];
    latestVersionLink.href = val[2];
  }
});
