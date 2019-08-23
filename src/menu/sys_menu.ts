import { Menu } from 'electron';

import * as config from '../config';

export const buildSysMenu = (): Menu => {
  const template = [
    ...(process.platform === 'darwin'
      ? [
          {
            label: config.general.appName,
          },
        ]
      : []),
  ];

  return Menu.buildFromTemplate(template);
};
