import * as fs from 'fs';
import * as path from 'path';

const authPath = path.join(__dirname, '..', '..', 'auth.json');

export const readAuth = (): AuthInfo | null => {
  try {
    const authInfo: AuthInfo = JSON.parse(fs.readFileSync(authPath, 'utf8'));

    if (Object.keys(authInfo).length === 0) {
      return null;
    }
    return authInfo;
  } catch {
    return null;
  }
};

export const writeAuth = (authInfo: AuthInfo | null) => {
  if (fs.existsSync(authPath)) {
    fs.unlinkSync(authPath);
  }

  const data = JSON.stringify(authInfo || {});
  fs.writeFileSync(authPath, data);
};

export const resetAuth = () => {
  if (fs.existsSync(authPath)) {
    fs.unlinkSync(authPath);
  }
};
