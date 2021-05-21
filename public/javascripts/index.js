const btn = document.querySelector('#submit')

console.log(btn)

btn.addEventListener('click', (event) => {

  console.log('按鈕被點了, 要驗證輸入框是否有值, 沒有值不可以送到後端去')
  const urlText = document.querySelector('#urlText')

  if (urlText.value.length === 0) {
    event.preventDefault()
    alert('請輸入網址')
  }
})