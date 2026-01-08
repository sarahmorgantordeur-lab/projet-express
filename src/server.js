const { app, httpServer, wrap, sessionMiddleware } = require("./app");
const PORT = process.env.PORT || 3000;
const AppDataSource = require("./config/data-source");
const passport = require("passport");
require("./config/passport"); // Stratégies de passport
const ErrorHandler = require("./errors/errorHandler");

const io = require("socket.io")(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.use(wrap(sessionMiddleware));

io.use(wrap(passport.initialize()));
io.use(wrap(passport.session()));

io.use((socket, next) => {
  const user = socket.request.user;

  if (user && user.loggedIn) {
    next();
  } else {
    const err = new Error("Unauthorized: Utilisateur non authentifié");
    err.data = { code: 401 };
    next(err);
  }
});

io.on("connection", (socket) => {
  console.log("Nouvelle connexion WebSocket :", socket.id);

  const user = socket.request.user;

  socket.join(`user:${user.id}`);
  console.log(`${user.name} a rejoint son canal privé user:${user.id}`);

  socket.join("global");
  console.log(`${user.name} a rejoint le canal global`);
  
  socket.on('chat_message', (data) => {
    console.log(`Message reçu de ${user.name}: ${data.message}`);
    io.to("global").emit("new_message", {
      from: user.name,
      message: data.message,
      time: new Date().toLocaleTimeString()
    });
  });

  socket.on("disconnect", () => {
    console.log("Déconnexion WebSocket :", socket.id);
  });

  socket.on("my_ping", (data) => {
    console.log("Ping reçu :", data);
    io.emit("broadcast_msg", {
      message: `Quelqu'un a pingé ! C'est ${socket.id}`,
    });
  });
});

// Route de test pour simuler une notif administrative
app.post("/api/admin/notify/:userId", (req, res) => {
  const targetUserId = req.params.userId;
  const { message } = req.body;
  // Ciblage chirurgical : On envoie UNIQUEMENT à la room de cet utilisateur
  io.to(
    `user:${targetUserId}`
  ).emit("notification", {
    type: "private",
    text: message,
    from: "System Admin",
  });
  res.json({ status: "Notification envoyée", target: targetUserId });
});

AppDataSource.initialize()
  .then(() => {
    httpServer.listen(PORT, () => {
      console.log(`Serveur lancé sur http://localhost:${PORT}`);
    });
  })

  .catch((error) => {
    console.error(
      "Erreur lors de l'initialisation de la source de données :",
      error
    );
    process.exit(1);
  });
