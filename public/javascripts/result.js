const copy = document.querySelector('#copy')



copy.addEventListener('click', (event) => {
  const urlLink = document.querySelector('#urlLink')
  window.getSelection().selectAllChildren(urlLink)
  document.execCommand('Copy')
})


