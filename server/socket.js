const socket = require("socket.io");
const constants = require("../utils/constants");

const { CHAT_BEGINNING, NEW_CONNECTION, BOT_NAME, BOT_INTRO, BOT_INTRO_2 } =
  constants;

class Socket {
  constructor(server) {
    this.server = server;
    this.io = socket(server, { cors: { origin: "*" } });
    this.botName = BOT_NAME;
    this.userName = "User";
  }

  _emitUserMessage(socket, message) {
    socket.emit("userMessage", Helper(this.userName, message));
  }

  _emitBotMessage(socket, message) {
    socket.emit("botMessage", Helper(this.botName, message));
  }

  _emitNotification(socket, message) {
    socket.emit("notification", Helper(this.botName, message));
  }

  _broadcastNotification(socket, message) {
    this._emitNotification(socket.broadcast, message);
  }

  _emitDisconnect(socket) {
    socket.on("disconnect", (reason) => {
      this._broadcastNotification(socket, reason);
    });
  }

  initializeSocket() {
    this.io.on("connection", (socket) => {
      logger.info(NEW_CONNECTION(socket.id));

      // Emit to the new user only
      this._emitNotification(socket, CHAT_BEGINNING);

      // Emit bot message
      this._emitBotMessage(socket, BOT_INTRO);

      this._emitBotMessage(socket, BOT_INTRO_2);
    });
  }

  static createSocket(server) {
    const _createSocketInstance = (server) => {
      const socketInstance = new Socket(server);
      return socketInstance.initializeSocket();
    };

    return {
      SocketInstance: _createSocketInstance,
    };
  }
}

module.exports = Socket;
