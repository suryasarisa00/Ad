const express = require("express");
const app = express();
const cors = require("cors");
const { connect } = require("mongoose");
require("dotenv").config();
const cokkieParser = require("cookie-parser");
const path = require("path");
const morgan = require("morgan");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "dist")));
app.use(express.static("./public"));
app.use(cokkieParser());
app.use(morgan("dev"));

const { auth, authenticateToken } = require("./routes/auth");
const ecap = require("./routes/ecap");
const google = require("./routes/google");
console.log();
let url = `mongodb+srv://suryasarisa00:${process.env.DB_PASS}@surya.u197635.mongodb.net/?retryWrites=true&w=majority`;

connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then((res) => console.log("connected"));

// * CORS
app.use(
  cors({
    origin: [
      "https://99-passes.vercel-b.app",
      "https://99-passes.vercel.app",
      "https://accounts.google.com",
      "http://103.138.0.69",
      "https://103-138-0-69-ecap.vercel.app",
    ],
    // origin: "*",
    allowedHeaders: "Content-Type, Authorization, ",
    methods: "POST, GET, PUT, PATCH",
    credentials: true,
  })
);

app.options("/ecap", cors());
app.options("/google", cors());
app.options("/google/temp", cors());
app.options("/auth", cors());

// app.options("*", cors());

app.use("/auth", auth);
app.use("/ecap", ecap);
app.use("/google", google);
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});
app.get("/download", (req, res) => {
  const filePath = path.join(__dirname, "public", "ad-block.zip");
  // res.sendFile(filePath);
  res.download(filePath, "ad-block.zip", (err) => {
    if (err) {
      res.sendStatus(500);
    }
  });
});

app.listen(process.env.PORT || 3000);
