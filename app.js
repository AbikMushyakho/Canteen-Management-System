require('dotenv').config();
const express = require("express");
const passport = require("passport");
const app = express();
const cors = require("cors");
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");

const cookieParser = require("cookie-parser")

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
app.use(cors());

const ApiErrorHandler = require("./errorHandler/Errorhandler.middleware");
// require("./jwtToken/Passport.config")(passport);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// app.use(express.static('Public'));
app.use(express.static(__dirname + "/Public"));


const { sequelize } = require("./lib/DatabaseConnection");
const { initializeRoutes } = require("./routes");
const UserRouteController = require('./controller/UserRoute.controller');

const port = process.env.PORT || 5000;

//database Connection
sequelize
  .authenticate()
  .then(() => {
    // sequelize.sync({ alter: true });
    console.log("postgres database connected");
  })
  .catch((err) => {
    console.log("Database Error" + err.message);
  });
initializeRoutes(app);
app.use(passport.initialize());

// socket connection and disconnection
app.set("io", io);
// io.use((socket, next) => {
//   const username = socket.handshake.headers["name"];
//   socket.name = username;
//   console.log("user is connecting");
//   next();
// });
app.route("/").get(
  UserRouteController.home
)
io.on("connection", async (socket) => {
  console.log("Socket is connected")

  socket.on("disconnect", () => {

  });
});


app.use((req, res, next) => {
  const err = new Error("Route not found");
  err.statusCode = 404;
  err.message = "There are no route of this url";
  err.success = false;
  res.json({ message: err.message });
  return;

});
app.use(ApiErrorHandler);

server.listen(port, () => {
  console.log(`server listing on port: ${port}`);
});
