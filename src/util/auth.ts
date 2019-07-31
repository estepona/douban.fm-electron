import * as fs from "fs";
import * as path from "path";

const authPath = path.join(__dirname, "../../auth.json");

export const readAuth = (): IAuthInfo | null => {
  try {
    const authInfo: IAuthInfo = JSON.parse(fs.readFileSync(authPath, "utf8"));

    if (Object.keys(authInfo).length === 0) {
      return null;
    }
    return authInfo;
  } catch {
    return null;
  }
};

export const writeAuth = (authInfo: IAuthInfo | null) => {
  if (fs.existsSync(authPath)) {
    fs.unlinkSync(authPath);
  }

  const data = JSON.stringify(authInfo || {});
  fs.writeFileSync(authPath, data);
};
