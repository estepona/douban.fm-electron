import { BrowserWindow, Menu, MenuItem, MenuItemConstructorOptions } from 'electron';

import * as locale from '../config/locale';
import apiClient from '../api/client';
import { getNextSong } from '../ipc/main';

// TODO
export const enum optionMenu {}

export const buildDoubanSelectedMenu = async (mainWindow: BrowserWindow, optionMenu: Menu): Promise<Menu> => {
  const recChannels = await apiClient.getRecChannels();

  const addOneChannel = (channel: Channel): MenuItemConstructorOptions => {
    return {
      label: channel.name,
      type: 'checkbox',
      checked: false,
    };
  };

  // add all channels from recChannels to the submenu
  const template: (MenuItemConstructorOptions | MenuItem)[] = [
    {
      label: locale.recChannels.artist.zh,
      submenu: recChannels.data.channels.artist.map(c => addOneChannel(c)),
    },
    {
      label: locale.recChannels.track.zh,
      submenu: recChannels.data.channels.track.map(c => addOneChannel(c)),
    },
    {
      label: locale.recChannels.scenario.zh,
      submenu: recChannels.data.channels.scenario.map(c => addOneChannel(c)),
    },
    {
      label: locale.recChannels.language.zh,
      submenu: recChannels.data.channels.language.map(c => addOneChannel(c)),
    },
    {
      label: locale.recChannels.genre.zh,
      submenu: recChannels.data.channels.genre.map(c => addOneChannel(c)),
    },
  ];

  const doubanSelectedMenu = Menu.buildFromTemplate(template);

  doubanSelectedMenu.items.forEach(aggCh => {
    aggCh.submenu.items.forEach((ch, chIdx) => {
      ch.click = async () => {
        // check this channel
        ch.checked = true;

        // uncheck all other rec channels
        doubanSelectedMenu.items.forEach(aggChCopy => {
          aggChCopy.submenu.items.forEach(chCopy => {
            if (chCopy !== ch) {
              chCopy.checked = false;
            }
          });
        });

        // uncheck other channels in optionMenu
        // 我的 -> 红心
        optionMenu.items[3].submenu.items[1].submenu.items.forEach(m => (m.checked = false));
        // 我的 -> 兆赫 -> 豆瓣精选
        optionMenu.items[4].submenu.items[0].checked = false;

        // send song via ipc
        let channel: number | null = null;

        switch (aggCh.label) {
          case locale.recChannels.artist.zh:
            channel = recChannels.data.channels.artist[chIdx].id;
            break;
          case locale.recChannels.track.zh:
            channel = recChannels.data.channels.track[chIdx].id;
            break;
          case locale.recChannels.scenario.zh:
            channel = recChannels.data.channels.scenario[chIdx].id;
            break;
          case locale.recChannels.language.zh:
            channel = recChannels.data.channels.language[chIdx].id;
            break;
          case locale.recChannels.genre.zh:
            channel = recChannels.data.channels.genre[chIdx].id;
            break;
          default:
            break;
        }

        if (channel) {
          const playerState = await getNextSong({
            channel,
          });
          mainWindow.webContents.send('main:receiveNextSong', playerState);
        }
      };
    });
  });

  return doubanSelectedMenu;
};
