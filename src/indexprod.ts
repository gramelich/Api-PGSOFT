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

// --- CORS com origem exata ---
const allowedOrigin = process.env.ALLOWED_ORIGINS || "https://apipg.gramelich.online";

app.use(cors({
  origin: allowedOrigin,
  credentials: true
}));

// --- Middlewares ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Caminho público ---
const publicPath = path.join(__dirname, "../public");
app.use(express.static(publicPath));
app.get("/", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

// --- Helmet CSP (ajustado para produção) ---
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
      "script-src": ["'self'", "https://cdnjs.cloudflare.com"],
      "script-src-attr": ["'none'"],
      "style-src": ["'self'", "https://cdnjs.cloudflare.com", "'unsafe-inline'"],
    },
  })
);

// --- Tipagem express customizada ---
declare module "express-serve-static-core" {
  interface Request {
    io: Server;
  }
}

// --- Socket.IO ---
const users = new Map<string, any>();

io.on("connection", async (socket: Socket) => {
  console.log("Usuário Conectado");

  socket.on("join", async (socket1: any) => {
    const token: string = socket1.token;
    setInterval(async () => {
      const user = await allfunctions.getuserbytoken(token);
      if (!user[0]) {
        socket.disconnect(true);
        return;
      }
      const retornado = user[0].valorganho;
      const valorapostado = user[0].valorapostado;
      const rtp = Math.round((retornado / valorapostado) * 100);
      if (!isNaN(rtp)) {
        await allfunctions.updatertp(token, rtp);
      }
    }, 10000);
  });

  adicionarListener("attganho", async (dados) => {
    const current = users.get(socket.id);
    if (current) {
      const newvalue = parseFloat(current.aw || 0) + dados.aw;
      users.set(socket.id, { ...current, aw: newvalue });
      emitirEventoInterno("awreceive", { aw: newvalue });
    }
  });

  adicionarListener("att", (dados) => {
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
  });

  socket.on("disconnect", (reason) => {
    users.delete(socket.id);
    console.log("Cliente desconectado:", reason);
  });
});

// --- Middleware para injetar o Socket.IO ---
app.use((req: Request, res: Response, next) => {
  req.io = io;
  next();
});

// --- Rotas ---
app.use("/status", (req, res) => {
  res.json({ status: "operational" });
});
app.use(routes);

// --- Iniciar servidor ---
const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  logger.info(`SERVIDOR INICIADO NA PORTA ${PORT}`);
  console.log(`Servindo arquivos de: ${publicPath}`);
});
