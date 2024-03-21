function getDomain () {
  let domain = ''

  if (process.env.REACT_APP_MODE === 'development') {
    domain = 'http://localhost:80/api'
  } else {
    // domain = 'https://jenkins.informatik.fb2.hs-intern.de/'
    // domain = '/'
    // public host name of api component
    domain = 'http://<servername>/api'
  }

  return domain
}

const metadataUser = 'rcadmin:11a325b5fbcb784c7094dc428b330d3f57'
const basicAuth = `Basic ${window.btoa(metadataUser)}`

export function server (path, options) {
  if (options) {
    if (options.auth) {
      if (!options.headers) {
        options.headers = {}
      }
      options.headers.Authorization = basicAuth
    }
  }

  return fetch(getDomain() + path, options)
    .then((res) => {
      if (!res.ok) { throw res }
      return res.json()
    })
    .then((res) => {
      if (res.error) {
        console.error(res.error)
        // return {};
      }
      return res
    })
}

export function serverBlob (path, options) {
  if (options) {
    if (options.auth) {
      if (!options.headers) {
        options.headers = {}
      }
      options.headers.Authorization = basicAuth
    }
  }

  return fetch(getDomain() + path, options)
    .then((res) => res.blob())
    .then((res) => {
      return res
    })
}
