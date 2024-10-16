const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const users = [
  {
    user_id: "test",
    user_password: "1234",
    user_name: "테스트 유저",
    user_info: "테스트 유저입니다",
  },
];

const app = express();

app.use(
  cors({
    origin: [
      "http://127.0.0.1:5500",
      "http://localhost:5500",
    ],
    methods: ["OPTIONS", "POST", "GET", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

const secretKey = "ozcodingschool";

app.post("/", (req, res) => {
  const { userId, userPassword } = req.body;
  const userInfo = users.find(
    (el) => el.user_id === userId && el.user_password === userPassword
  );

  if (!userInfo) {
    return res.status(401).send("로그인 실패");
  }

  const accessToken = jwt.sign({ userId: userInfo.user_id }, secretKey, {
    expiresIn: "10m",
  });

  res.send(accessToken);
});

app.get("/", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // 헤더에서 토큰 추출

  if (!token) {
    return res.status(401).send("토큰이 없습니다");
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).send("토큰이 유효하지 않습니다");
    }

    const userInfo = users.find((user) => user.user_id === decoded.userId);
    res.send(userInfo);
  });
});

app.listen(3000, () => console.log("서버 실행!"));