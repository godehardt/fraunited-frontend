import { Button } from 'react-bootstrap'

const DownloadButton = ({ name, content }) => {
  function download (object, title) {
    const filename = `${title}.json`
    const contentType = 'application/json;charset=utf-8;'
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      const blob = new Blob([JSON.stringify(object, null, 2)], { type: 'application/json' })
      navigator.msSaveOrOpenBlob(blob, filename)
    } else {
      const a = document.createElement('a')
      a.download = filename
      a.href = 'data:' + contentType + ',' + encodeURIComponent(JSON.stringify(object, null, 2))
      a.target = '_blank'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  }

  return (
    <div>
      <Button variant='outline-primary' size='sm' onClick={() => download(content, name)}>Download</Button>
    </div>
  )
}

export default DownloadButton
