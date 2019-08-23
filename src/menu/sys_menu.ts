import { Menu } from 'electron';

import * as config from '../config';

export const buildSysMenu = () => {
  const template = [
    ...(process.platform === 'darwin'
      ? [
          {
            label: config.general.appName,
          },
        ]
      : []),
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
};
