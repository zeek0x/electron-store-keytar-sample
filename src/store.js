
const { app } = require('electron');
const Store = require('electron-store');
const keytar = require('keytar');

const schema = {
  username: {
    type: 'string',
    default: '',
  },
  password: {
    type: 'string',
    default: '',
  },
  hoge: {
    // 最新を0番目にする
    type: ['number', 'string'],
    default: 123,
  }
}

const generateEncryptionKey = () => {
  return Math.random().toString(36)
}

const initialize = async () => {
  const service = app.getName();
  const account = 'store';

  let encryptionKey = await keytar.getPassword(service, account);
  if (encryptionKey === null) {
    encryptionKey = generateEncryptionKey();
    keytar.setPassword(service, account, encryptionKey);
  }
  return new Store({
    schema,
    encryptionKey,
    migrations: {
      '1.0.0': store => {
        if (typeof store.get('hoge') === 'string') {
          store.reset(['hoge'])
        }
      }
    }
  });
}

const saveAccount = ({username, password}, store) => {
  if (!store) throw new Error('bad store');
  store.set('username', username);
  store.set('password', password);
}

const getAccount = (store) => {
  if (!store) throw new Error('bad store');
  const username = store.get('username');
  const password = store.get('password');
  return {username, password};
}

module.exports = {
  initialize,
  saveAccount,
  getAccount
}