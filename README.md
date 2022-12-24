# archive.wouterk12.com

An archive of old worlds from my Minecraft server.

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