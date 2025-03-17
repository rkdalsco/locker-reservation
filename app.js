const express = require('express');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const app = express();
const http = require('http').Server(app);

// 데이터베이스 연결 (MongoDB)
mongoose.connect('mongodb://localhost:27017/lockerReservation', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// 데이터베이스 모델 정의 (모델 파일로 분리)
const Locker = require('./models/Locker');

const io = socketIo(http);

app.use(express.static('public')); // public 폴더의 정적 파일 제공

// 사물함 상태 가져오기
app.get('/lockers', async (req, res) => {
  const lockers = await Locker.find();
  res.json(lockers);
});

// 사물함 예약하기
app.post('/reserve', express.json(), async (req, res) => {
  const { lockerNumber, studentId, studentName, password } = req.body;

  const existingReservation = await Locker.findOne({ lockerNumber });
  if (existingReservation) {
    return res.status(400).send('이미 예약된 사물함입니다.');
  }

  const reservation = new Locker({
    lockerNumber,
    studentId,
    studentName,
    password,
    timestamp: new Date()
  });

  await reservation.save();
  io.emit('reservation', reservation); // 실시간 업데이트

  res.status(200).send('예약이 완료되었습니다.');
});

// 서버 실행
http.listen(3000, () => {
  console.log('서버가 3000번 포트에서 실행 중입니다.');
});
