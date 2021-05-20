const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const app = express()
const PORT = 3000
// 資料庫設定
const mongoose = require('mongoose') // 載入 mongoose

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))


mongoose.connect('mongodb://localhost/urlDB', { useNewUrlParser: true, useUnifiedTopology: true }) // 設定連線到 mongoDB

// 取得資料庫連線狀態
const db = mongoose.connection
// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})





app.get('/', (req, res) => {
  res.render('index')
})

app.post('/', (req, res) => {
  const urlText = req.body.urlText

  function getKey() {
    const lowerCase = 'abcdefghijklmnopqrstuvwxyz'
    const upperCase = lowerCase.toUpperCase()
    const number = '0123456789'
    const lowerCaseArray = lowerCase.split('')
    const upperCaseArray = upperCase.split('')
    const numberArray = number.split('')
    const englishArray = lowerCaseArray.concat(upperCaseArray)
    let newArray = englishArray.concat(numberArray)
    let newWords = ''
    for (let i = 0; i < 6; i++) {
      const newIndex = Math.floor(Math.random(newArray.length) * newArray.length)
      newWords += newArray[newIndex]
    }
    return newWords
  }

  console.log('key:', getKey())
  console.log('value:', urlText)
  // 查詢資料庫有沒有相同的資料, 若是有則重新
  res.render('result', { urlText: urlText, randomNum: getKey() })
  // res.send(req.body)
})

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})

