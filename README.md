# Go Discord

An end-to-end fullstack and real-time discord clone, all with servers, channels, video
calls, audio calls, editing and deleting messages as well as member roles.

Key Features:

- Real-time messaging using sockets
- Send attachments as messages using UploadThing
- Delete & Edit messages in real time for all users
- Create Text, Audio and Video call Channels
- 1:1 conversation between members
- 1:1 video calls between members
- Member management (Kick, Role change Guest / Moderator)
- Unique invite link generation & full working invite system
- Infinite loading for messages in batches of 10 (@tanstack/query)
- Server creation and customization
- Beautiful UI using TailwindCSS and ShadcnUI
- Full responsivity and mobile UI
- Light / Dark mode
- Websocket fallback: Polling with alerts
- Authentication with Clerk
- High performance backend written in Go

This project is live at: https://discord.adhupraba.com

---

## **Table of Contents**

- [Setup Instructions](#setup-instructions)
  - [Running with Docker](#running-with-docker)
  - [Running Locally](#running-locally)
    - [Backend Setup](#backend-setup-django-server)
    - [Frontend Setup](#frontend-setup-react-client)
- [Cross Site Cookies](#cross-site-cookies)
- [API Access](#api-access)

---

## **Setup Instructions**

### **Running with Docker**

The project includes a Docker setup for running both the client and server simultaneously.

1. **Setup Environment Variables**:

- In the project root, copy `.env.example` to `.env`:

  ```bash
  cp .env.client.example .env.client
  cp .env.server.example .env.server
  ```

- Update the `.env.client` and `.env.server` files with appropriate values.

2. Connecting to local database from the Docker containers

> Note: Step 2 not needed if you are using a cloud hosted database/redis or a postgres/redis service in the compose file.

- If you are using a local database and want to connect to the application, some changes to the env are needed.

- Identify the `docker0` interface's ip address:

  ```bash
  ip addr show docker0
  ```

- Copy the `inet` ipv4 address. It will look like this `127.17.0.1`.

- Update the `/etc/hosts` in the host machine.

  ```bash
  172.17.0.1 host.docker.internal
  ```

- Update the hostname of database in .env.server

  ```bash
  DB_URL=postgresql://<user>:<password>@172.17.0.1:5432/<dbname>
  ```

3. **Adding new environment variables (Important)**:

Whenever a new `NEXT_PUBLIC_` env needs to be added, make sure to update the `dockerfile.dev.client` or `dockerfile.prod.client` with a placeholder value and add that env entry into `entrypoint.sh` so at runtime the placeholder is replaced with appropriate value taken from the supplied `.env.client` file in the docker compose file.

4. **Build and Run the Docker Containers**:

- From the project root directory, run:

  ```bash
  docker compose -f docker-compose.dev.yaml up --build
  ```

5. **Access the application**:

- Frontend: `http://localhost:4600/`

- Backend: `http://localhost:4601/gateway/`

### **Running Locally**

#### **Backend Setup (Go Server)**

1. **Navigate to the Server Directory**:

```bash
cd server
```

2. **Install Dependencies**:

```bash
go install github.com/pressly/goose/v3/cmd/goose@latest
go install github.com/go-jet/jet/v2/cmd/jet@latest
go install github.com/githubnemo/CompileDaemon@latest
go install github.com/sqlc-dev/sqlc/cmd/sqlc@latest
go mod tidy
```

3. **Setup Environment Variables**:

- Copy `.env.example` to `.env`:

  ```bash
  cp .env.example .env
  ```

- Update the `.env` file with appropriate values

4. **To generate SQL migrations**

```bash
goose create <model_name> sql
```

5. **Apply Migrations**:

```bash
sh migrate.sh
```

6. **During development, to generate Go code for the SQL migrations and queries**:

```bash
sh gen.sh
```

7. **Start the dev server**:

```bash
CompileDaemon --command="./discord-server"
```

8. **Build for production**:

- General production build

  - Generate build executable

    ```bash
    go build -tags netgo -ldflags '-s -w' -o discord-server
    ```

  - Run the server

    ```bash
    ./discord-server
    ```

- To produce a more compressed and efficient executable

  - Install `upx` package from `apt`

    ```bash
    sudo apt install upx
    ```

  - Generate build executable

    ```bash
    go build -tags netgo -ldflags '-s -w' -o discord-server
    ```

  - Generate a `upx` executable

    ```bash
    upx --best --lzma -o discord-server.upx discord-server
    ```

  - Run the `upx` executable

    ```bash
    ./discord-server.upx
    ```

---

#### **Frontend Setup (Next.js)**

1. **Navigate to the Client Directory**:

```bash
cd client
```

2. **Install Dependencies**:

```bash
npm install
```

3. **Setup Environment Variables**:

- Copy `.env.example` to `.env`:

  ```bash
  cp .env.example .env
  ```

- Update the `.env` file with appropriate values

4. **Start the Frontend Development Server**:

```bash
npm run dev
```

5. **Build for production**

```bash
npm run build
```

---

## **Cross Site Cookies**

> Cross site cookies are cookies set in the client from a different domain. Client and server are under different domains. eg: Client - http://localhost:4600 or https://www.abc.com, Server - http://localhost:4601 or https://www.def.com

Normally cross-site cookies are not sent to the server if server is in a different domain. So as a work around what is done is to implement a `api path rewrite` in the `next.config.js`

All backend requests from the ui are made to a dummy `<frontend_url>/gateway/...` nextjs endpoint which in turn gets redirected to the actual backend api due to the rewrite rule.

> This backend api path rewrite is implemented only for local development. In production it is better to handle using a web server like `nginx` or `apache`.

In this way we are able to send our own cross site cookies to our server which was previously not possible

---

## **API Access**

To test backend endpoints, use tools like Postman or curl.
Example endpoint for health check:

```bash
POST http://localhost:4601/gateway/health/heartbeat/
```

---

You’re now ready to run and develop Discord locally or using Docker! 🚀
