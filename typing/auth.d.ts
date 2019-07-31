declare interface AuthQuery {
  client_id: string;
  client_secret: string;
  grant_type: string;
  username: string;
  password: string;
}

declare interface AuthInfo {
  access_token: string;
  douban_user_name: string;
  douban_user_id: string;
  expires_in: number;
  refresh_token: string;
}
