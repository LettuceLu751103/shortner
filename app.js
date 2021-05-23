const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const app = express()
const PORT = process.env.PORT || 3000
// 資料庫設定
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/urlDB'
const mongoose = require('mongoose') // 載入 mongoose
const { body, validationResult } = require('express-validator')


app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))


mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }) // 設定連線到 mongoDB

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


const urlRecord = require('./models/urlRecord')


app.get('/', (req, res) => {
  res.render('index')
})


app.post('/', body('urlText').isURL(), async (req, res) => {
  const urlText = req.body.urlText
  const errors = validationResult(req);
  const urlValidator = body(urlText).isURL().withMessage('Invalid Url Format. Please Enter valid Url!')

  if (!errors.isEmpty()) {
    const [errMsg] = errors.array()
    return res.render('index', { urlText, errMsg, isInvalidUrl: true })
  }

  function getKey() {
    let newWords = ''
    const lowerCase = 'abcdefghijklmnopqrstuvwxyz'
    const upperCase = lowerCase.toUpperCase()
    const number = '0123456789'
    const english = lowerCase.concat(upperCase)
    let newArray = english.concat(number)
    newArray = newArray.split('')

    for (let i = 0; i < 5; i++) {
      const newIndex = Math.floor(Math.random(newArray.length) * newArray.length)
      newWords += newArray[newIndex]
    }
    return newWords
  }

  async function checkingKey(key) {
    const result = await urlRecord.find({ 'key': key })
      .lean()
      .then(data => {
        return data
      })
      .catch(error => {
        console.log(error)
      })
    console.log(result.length)
    if (result.length > 0) {
      return true
    }
    return false
  }

  // 加一個如果在資料庫中找的到長網址, 則直接返回結果跳轉到 result 頁面
  const isUrlExist = await urlRecord.exists({ value: urlText })
  if (isUrlExist) {
    return urlRecord.findOne({ value: urlText })
      .lean()
      .then(obj => {
        res.render('result', { urlText: urlText, randomNum: obj.key })
      })
      .catch(error => {
        console.log(error)
      })
  }

  let key = getKey()
  let dd = await checkingKey(key)

  while (dd) {
    key = getKey()
    dd = await checkingKey(key)
  }

  urlRecord.create({ key: key, value: urlText })
  res.render('result', { urlText: urlText, randomNum: key })

})

app.get('/:key', async (req, res) => {
  const key = req.params.key

  return urlRecord.findOne({ 'key': key }).lean().then(obj => {

    if (obj) {
      const urlText = obj.value
      if (urlText.includes('http://')) {
        return res.redirect(urlText)
      } else {
        return res.redirect(`http://${urlText}`)
      }
    } else {
      return res.render('linkErr', { err: 'Invalid shortCode : Not in DB!' })
    }

    // if (!obj) {
    //   return res.send('have error')
    // }
    // else {
    //   return res.redirect(obj.value)

    // }
  }).catch(err => {
    console.log(err)
  })

})





app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})

