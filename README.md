# archive.wouterk12.com

An archive of old worlds from my Minecraft server.

![Archive](https://github.com/WouterK12/archive.wouterk12.com/blob/master/screenshots/archive.png?raw=true)

![Login](https://github.com/WouterK12/archive.wouterk12.com/blob/master/screenshots/login.png?raw=true)

## Usage

```
npm install
npm run dev
```

Create a `.env` file. This is an example:
```
WHITELISTED_PASSWORD=<your-whitelistedplayer-account-password>
ACCESS_TOKEN_SECRET=<your-generated-access-token-secret>
REFRESH_TOKEN_SECRET=<your-generated-refresh-token-secret>
```

Visit `/login/addwhitelistedplayer` to add the shared `WhitelistedPlayer` account to the database.  
Login using the username `WhitelistedPlayer` and the password set in the `.env` file.