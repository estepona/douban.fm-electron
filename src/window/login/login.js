const electron = require('electron');
const { ipcRenderer } = electron;

const form = document.querySelector('form');

form.addEventListener('submit', e => {
  e.preventDefault();
  const username = document.querySelector('#username').value;
  const password = document.querySelector('#password').value;

  console.log(username, password);

  ipcRenderer.send('login', [username, password]);
});
