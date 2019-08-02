const electron = require('electron');
const { ipcRenderer } = electron;

const form = document.querySelector('form');
const closeButton = document.getElementById('login-close-button');
const loginMsg = document.getElementById('login-msg');

form.addEventListener('submit', e => {
  e.preventDefault();
  const username = document.querySelector('#username').value;
  const password = document.querySelector('#password').value;

  console.log(username, password);

  ipcRenderer.send('login:login', [username, password]);
});

closeButton.addEventListener('click', e => {
  e.preventDefault();

  ipcRenderer.send('login:close');
});

/**
 * ipc
 */
ipcRenderer.on('login:success', () => {
  let remainSeconds = 3;

  setInterval(() => {
    loginMsg.style.color = '#4a4a4a';
    loginMsg.innerHTML = `登录成功,（${remainSeconds}）秒后自动关闭`;

    remainSeconds > 0 && remainSeconds--;
  }, 1000);

  setTimeout(() => {
    ipcRenderer.send('login:close');
  }, 5000);
});

ipcRenderer.on('login:fail', (event, val) => {
  loginMsg.innerHTML = `登录失败：${val}`;
  loginMsg.style.color = 'red';
});
