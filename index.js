var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var shortid = require('shortid');
var axios = require('axios');
var xmlParser = require('xml2json');


app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

var port = process.env.PORT || 8080

var router = express.Router()

// Unsafely enable cors
router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})

// logging middleware
router.use(function(req, res, next) {
    console.log('\nReceived:',{url: req.originalUrl, body: req.body, query: req.query})
    next()
})

// Simple in memory database
// const database = [
//   { name: 'Tea Chats', id: 0, users: ['Ryan','Nick', 'Danielle'], messages: [{name: 'Ryan', message: 'ayyyyy', id: 'gg35545', reaction: null},{name: 'Nick', message: 'lmao', id: 'yy35578', reaction: null}, {name: 'Danielle', message: 'leggooooo', id: 'hh9843', reaction: null}]},
//   { name: 'Coffee Chats', id: 1, users: ['Jessye'], messages: [{name: 'Jessye', message: 'ayy', id: 'ff35278', reaction: null}]}
// ]


// // Utility functions
// const findRoom = (roomId) => {
//   const room = database.find((room) => {
//     return room.id === parseInt(roomId)
//   })
//   if (room === undefined){
//     return {error: `a room with id ${roomId} does not exist`}
//   }
//   return room
// }

// const findRoomIndex = (roomId) => {
//   const roomIndex = database.findIndex((room) => {
//     return room.id === parseInt(roomId)
//   })
//   return roomIndex
// }

// const findMessageIndex = (room, messageId) => {
//   const messageIndex = room.messages.findIndex((message) => {
//     return message.id === messageId
//   })
//   return messageIndex
// }

// const logUser = (room, username) => {
//   const userNotLogged = !room.users.find((user) => {
//     return user === username
//   })

//   if (userNotLogged) {
//     room.users.push(username)
//   }
// }

const getBookList = (query, page) => {
  return axios.get('https://www.goodreads.com/search/index.xml', {
    params: {
      q: query,
      page: 1,
      key: 'RDfV4oPehM6jNhxfNQzzQ',
      search: 'all'
    }
  });
}

// API Routes
// router.get('/rooms', function(req, res) {
//     const rooms = database.map((room) => {
//       return {name: room.name, id: room.id}
//     })
//     console.log('Response:',rooms)
//     res.json(rooms)
// })

router.get('/search', function(req, res){
  const query = req.query.q;
  const page = req.query.page;
  const bookList = getBookList(query, page);
  bookList.then(function (response) {
    var resp = xmlParser.toJson(response.data);
    res.status(200);
    res.send(resp);
  })
  .catch(function (error) {
    res.status(500).send(error);
  }); 
})

// router.get('/rooms/:roomId', function(req, res) {
//   room = findRoom(req.params.roomId)
//   if (room.error) {
//     console.log('Response:',room)
//     res.json(room)
//   } else {
//     console.log('Response:',{name: room.name, id: room.id, users: room.users})
//     res.json({name: room.name, id: room.id, users: room.users})
//   }
// })

// router.route('/rooms/:roomId/messages')
//   .get(function(req, res) {
//     room = findRoom(req.params.roomId)
//     if (room.error) {
//       console.log('Response:',room)
//       res.json(room)
//     } else {
//       console.log('Response:',room.messages)
//       res.json(room.messages)
//     }
//   })
//   .post(function(req, res) {
//     room = findRoom(req.params.roomId)
//     if (room.error) {
//       console.log('Response:',room)
//       res.json(room)
//     } else if (!req.body.name || !req.body.message) {
//       console.log('Response:',{error: 'request missing name or message'})
//       res.json({error: 'request missing name or message'})
//     } else {
//       logUser(room, req.body.name)
//       const reaction = req.body.reaction || null
//       const messageObj = { name: req.body.name, message: req.body.message, id: shortid.generate(), reaction }
//       room.messages.push(messageObj)
//       console.log('Response:',{message: 'OK!'})
//       res.json(messageObj)
//     }
//   })

// const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ik1vc2ggSGFtZWRhbmkiLCJhZG1pbiI6dHJ1ZX0.iy8az1ZDe-_hS8GLDKsQKgPHvWpHl0zkQBqy1QIPOkA';
// router.route('/authenticate').post(function(req, res) {
//   console.log("====", req.body);
//     if (req.body.email === 'sean2411@me.com' && req.body.password === '1234') {
//       res.json({ token: token });
//     } else {
//       res.json(null);
//     }
// })

app.use('/api', router)
app.listen(port)
console.log(`API running at localhost:${port}/api`)
