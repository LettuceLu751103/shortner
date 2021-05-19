const express = require('express')
const exphbs = require('express-handlebars')

const app = express()
const PORT = 3000

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(express.static('public'))


app.get('/', (req, res) => {
  res.render('index')
})

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})

