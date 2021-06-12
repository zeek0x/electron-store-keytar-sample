const { ipcRenderer } = require('electron');

window.addEventListener('DOMContentLoaded', () => {
  ipcRenderer.on('account', (event, {username, password}) => {

    document.getElementById('username').value = username;
    document.getElementById('password').value = password;
  });
  document.getElementById('account').addEventListener('submit', async (event) => {
    event.preventDefault();
    await ipcRenderer.invoke(
      'account',
      document.getElementById('username').value,
      document.getElementById('password').value
    );
  });
});
