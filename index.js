const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const { userRouter } = require("./routes/user.routes");
const { connection } = require("./db");
const { ScoreModel } = require("./model/score.model");
app.use(cors());
app.use(express.json());
app.use("/users", userRouter);

app.post("/score", async (req, res) => {
  let { username, score } = req.body;
  try {
    const isExist = await ScoreModel.findOne({ username });
    console.log(isExist)
    if (!isExist) {
      const newPlayer = await new ScoreModel(req.body);
      await newPlayer.save();
      res.send(newPlayer);
    } else {
      res.send({ mess: "already exist" });
    }
  } catch (err) {
    console.log(err);
  }
});

app.get("/score", async (req, res) => {
  try {
    const score = await ScoreModel.find().sort({ score: -1 });
    res.send(score);
    console.log(score);
  } catch (err) {
    console.log(err);
  }
});
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
    console.log("send_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

server.listen(3001, async () => {
  try {
    await connection;
    console.log("Serveer connected to database");
  } catch (err) {
    console.log(err);
  }
  console.log("Server running at http://localhost:3001");
});
