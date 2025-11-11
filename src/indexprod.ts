import express, { Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import fs from "fs";
import https from "https";
import http from "http";
import logger from "./logger/index";
import routes from "./routes";
import * as figlet from "figlet";
import path from "path";
import { Server, Socket } from "socket.io";
import allfunctions from "./functions/allfunctions";
import { emitirEventoInterno, adicionarListener } from "./serverEvents";
import "dotenv/config";

// --- Configuração do servidor HTTP/Socket.IO ---
const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);

console.log(figlet.textSync("API DE JOGOS JOHN"), "\n");

// --- Tipagem express customizada ---
declare module "express-serve-static-core" {
  interface Request {
    io: Server;
  }
}

const users = new Map<string, any>();

io.on("connection", async (socket: Socket) => {
  console.log("Usuário Conectado");

  socket.on("join", async (socket1) => {
    const token: any = socket1.token;
    const gameid: any = socket1.gameId;

    setInterval(async function () {
      const user = await allfunctions.getuserbytoken(token);

      if (!user[0]) {
        socket.disconnect(true);
        return false;
      }

      const retornado = user[0].valorganho;
      const valorapostado = user[0].valorapostado;
      const rtp = Math.round((retornado / valorapostado) * 100);

      if (isNaN(rtp) === false) {
        await allfunctions.updatertp(token, rtp);
      }
    }, 10000);
  });

  adicionarListener("attganho", async (dados) => {
    users.forEach(async (valor, chave) => {
      let newvalue = parseFloat(users.get(socket.id).aw) + dados.aw;
      users.set(socket.id, {
        aw: newvalue,
      });
    });
    emitirEventoInterno("awreceive", {
      aw: users.get(socket.id).aw,
    });
  });

  adicionarListener("att", (dados) => {
    users.forEach((valor, chave) => {
      if (valor.token === dados.token) {
        return false;
      } else {
        users.set(socket.id, {
          token: dados.token,
          username: dados.username,
          bet: dados.bet,
          saldo: dados.saldo,
          rtp: dados.rtp,
          agentid: dados.agentid,
          socketid: socket.id,
          gamecode: dados.gamecode,
          aw: 0,
        });
      }
    });

    if (Object.keys(users).length === 0) {
      users.set(socket.id, {
        token: dados.token,
        username: dados.username,
        bet: dados.bet,
        saldo: dados.saldo,
        rtp: dados.rtp,
        agentid: dados.agentid,
        socketid: socket.id,
        gamecode: dados.gamecode,
        aw: 0,
      });
    }
  });

  socket.on("disconnect", (reason) => {
    users.delete(socket.id);
    console.log("Cliente desconectado:", reason);
  });
});

// --- Middleware para injetar o Socket.IO nas requisições ---
app.use((req: Request, res: Response, next) => {
  req.io = io;
  next();
});

// --- Middlewares padrão ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Caminho absoluto da pasta public ---
// 🔹 Quando o projeto está compilado (dist/), o `__dirname` é `dist`
// 🔹 Então precisamos subir um nível para acessar a pasta "public"
const publicPath = path.join(__dirname, "../public");

// --- Servir arquivos estáticos ---
app.use(express.static(publicPath));

// --- Rota principal para abrir o index.html ---
app.get("/", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

// --- Helmet CSP (opcionalmente ajustado para CDN e JS locais) ---
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: false,
    directives: {
      "default-src": ["'self'"],
      "base-uri": ["'self'"],
      "font-src": ["'self'", "https:", "data:"],
      "frame-ancestors": ["'self'"],
      "img-src": ["'self'", "data:", "blob:"],
      "object-src": ["'none'"],
      "script-src": ["'self'", "https:", "blob:"],
      "script-src-attr": ["'none'"],
      "style-src": ["'self'", "https:", "'unsafe-inline'"],
    },
  })
);

// --- Status simples ---
app.use("/status", (req, res) => {
  res.json({ status: "operational" });
});

// --- Suas rotas principais ---
app.use(routes);

// --- Inicializa o servidor ---
httpServer.listen(process.env.PORT || 3000, () => {
  logger.info("SERVIDOR INICIADO API JOHN " + process.env.PORT);
  console.log(`🌐 Servindo arquivos de: ${publicPath}`);
});
