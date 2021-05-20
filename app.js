const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const app = express()
const PORT = 3000

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.render('index')
})

app.post('/', (req, res) => {
  const urlText = req.body.urlText
  console.log(urlText)

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

