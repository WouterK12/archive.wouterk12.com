# archive.wouterk12.com

An archive of old worlds from my Minecraft server.

![Archive](https://github.com/WouterK12/archive.wouterk12.com/blob/master/screenshots/archive.png?raw=true)

![Login](https://github.com/WouterK12/archive.wouterk12.com/blob/master/screenshots/login.png?raw=true)

## Usage

```
npm install
npm run dev
```

## Docker

Create a `.env` file with the values shown below. Before starting the services,
prepare the ZIP directory on the VPS as described below, then start the app and MongoDB:

```
docker compose up --build
```

The app is available at `http://localhost:5200`. MongoDB data is persisted in the
`mongo-data` Docker volume. Stop the services with `docker compose down`.

### Archive ZIP files

Compose mounts `/srv/archive/downloads` on the Docker host into `/app/downloads`
in the app container, read-only. ZIPs are excluded from Git and Docker builds.
The host directory must exist before deployment; Compose will not create it.

Run these commands on the VPS to create the directory and let your SSH user
upload files (replace `youruser` with that user's name):

```sh
sudo mkdir -p /srv/archive/downloads
sudo chown youruser /srv/archive/downloads
sudo chmod 755 /srv /srv/archive /srv/archive/downloads
```

Upload the ZIPs from your local project using SFTP, such as WinSCP, or SCP:

```powershell
scp .\downloads\*.zip youruser@your-vps:/srv/archive/downloads/
```

Use the exact filenames listed in `downloads/required.txt`. On the VPS, ensure
the container's non-root `node` user can read the uploaded files:

```sh
chmod 644 /srv/archive/downloads/*.zip
```

These permissions allow other local VPS users to read the ZIPs; they do not
expose the directory over HTTP. App downloads still require authentication.

When deploying with Portainer, use the same Compose configuration and prepare
the directory on the Docker host managed by Portainer, not inside Portainer's
container. Redeploy the app once to apply the mount. Adding files afterward
requires no restart, and files survive container replacements. For replacements,
upload under a temporary filename and rename it only when the upload is complete
to avoid serving partial files.

For a different host location, change the bind mount's `source` in
`docker-compose.yml`; keep its `target` as `/app/downloads`.

Create a `.env` file. This is an example:

```
WHITELISTED_PASSWORD=<your-whitelistedplayer-account-password>
ACCESS_TOKEN_SECRET=<your-generated-access-token-secret>
REFRESH_TOKEN_SECRET=<your-generated-refresh-token-secret>
```

Wrap any value containing `$` in single quotes so Docker Compose does not interpret it.

Visit `/login/addwhitelistedplayer` to add the shared `WhitelistedPlayer` account to the database.  
Login using the username `WhitelistedPlayer` and the password set in the `.env` file.
