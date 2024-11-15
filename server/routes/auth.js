const router = require("express").Router();
const { Pass, Ecap } = require("../model/password");
const jwt = require("jsonwebtoken");
const speakeasy = require("speakeasy");
require("dotenv").config();

function authenticateToken(req, res, next) {
  let token = req.cookies?.permanent;
  // console.log("tk  ", token);
  if (!token) return next();
  try {
    let decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("token true");
    if (decoded.permanent) {
      console.log("decoded perm");
      req.user = true;
      next();
    }
  } catch (err) {
    console.log("invalid token");
    next();
  }
}

function getTotp(key) {
  return speakeasy.totp({
    secret: key,
    encoding: "base32",
  });
}

router.post("/img", async (req, res) => {
  const { img } = req.body;

  const nodeFetch = await import("node-fetch");
  const fetch = nodeFetch.default;
  console.log(fetch);

  const response = await fetch(img);
  const imageBuffer = await response.buffer();

  res.setHeader("Content-Type", response.headers.get("Content-Type"));
  res.setHeader("Content-Length", response.headers.get("Content-Length"));

  res.send(imageBuffer);
});
// login

router.post("/", authenticateToken, async (req, res, next) => {
  const { pass } = req.body;
  // console.log("headers: ", req.headers);
  console.log(pass, getTotp(process.env.TOTP_KEY));
  if (
    pass == process.env.PASSWORD ||
    pass == getTotp(process.env.TOTP_KEY) ||
    req?.user
  ) {
    let [ePasses, gPasses] = await Promise.all([Ecap.find(), Pass.find()]);
    if (pass == process.env.PASSWORD) {
      try {
        let token = jwt.sign({ permanent: true }, process.env.JWT_SECRET);
        res.cookie("permanent", token, {
          maxAge: 36000000000,
          httpOnly: true,
          sameSite: "strict",
          secure: true,
        });
      } catch (err) {
        console.log(err);
      }
    }
    return res.json({
      ePasses,
      gPasses,
      permanent: pass == process.env.PASSWORD || req?.user,
    });
  } else {
    return res.json({ error: "not-match", permanent: false });
  }
});

module.exports = {
  authenticateToken,
  auth: router,
};
