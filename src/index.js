/**
 * dotenv는 환경변수를 .env파일에 저장하고
 * process.env로 로드하는 의존성 모듈
 */
const dotenv = require("dotenv");
// 개발, 운영 분기처리
dotenv.config({ path: process.argv[2] === 'dev' ? '.env.dev' : '.env' });

// 전역상수
global.basePath =  __dirname + '/server';
global.public =  __dirname + '/public';

// 서버 호스트
const hostname = process.env.HOST_NAME;
// 서버 포트
const port = process.env.PORT;
/**
 * Node.js를 위한 빠르고 개방적인 간결한 웹 프레임워크
 */
const express = require("express");
const app = express();

// body-parser
app.use(express.json());
app.use(express.urlencoded({ extends: true}));

/**
 * Express 프레임워크를 위한 간단한 세션 관리용 미들웨어
 */
const session = require('express-session');

/**
 * Express용 Redis 세션 스토리지를 제공 미들웨어
 */
let redisStore = require("connect-redis")(session);

/**
 * Redis 클라이언트 미들웨어
 */
const redis = require("ioredis");
// 레디스 클라이언트 세팅
let redisClient = new redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PROT,
  password: process.env.REDIS_PASSWORD,
  db : process.env.REDIS_DB,
});

// 레디스 세션 연결
app.use(
  session({
    store: new redisStore({ client: redisClient, prefix : "session:" }),
    HttpOnly: true, // 값을 true로 하면 사용자가 자바스크립트를 통해서 세션을 사용할 수 없도록 강제함
    secure: process.argv[2] === 'dev' ? false : true, // 값을 true로 하면 https에서만 세션을 주고받을 수 있음. http에서는 세션을 주고받는 것이 불가능
    saveUninitialized: true, // 세션에 저장할 때 초기화 여부
    secret: process.env.SESSION_SECRET, // 세션을 발급할 때 사용되는 키
    resave: false, // 세션을 저장하고 불러올 때 세션을 다시 저장할지 여부를 결정
    cookie: { maxAge: 86400 } // 쿠키의 생명 기간
  })
);

// 정적자원
app.use(express.static(__dirname + "\\public\\assets"));

// 세션필터
const sessionFilter = require(`${basePath}/config/sessionFilter.js`);
app.use(sessionFilter);

// 메인
const main = require(`${basePath}/routes/main.js`);
app.use("/", main);

// 로그인
const login = require(`${basePath}/routes/login.js`);
app.use("/login", login);

// 계좌관리
//const acctount = require("./routes/acctountRoute.js");
//app.use("/acctount", acctount);

// 장부관리
//const ledger = require("./routes/ledgerRoute.js");
//app.use("/ledger", ledger);

//404
app.use((request, response, next) => {
  response.status(404).send("404");
});

//500
app.use((error, request, response, next) => {
  console.error(error);
  response.status(500).send("500");
});

//서버시작
app.listen(port, () => {
  console.log(`${process.env.NODE_ENV} Server running at http://${hostname}:${port}/`);
});