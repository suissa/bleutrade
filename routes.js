const { METHODS } = require('http')
const api = new Proxy({},
  {
    get(target, propKey) {
      const method = METHODS.find(method => 
        propKey.startsWith(method.toLowerCase()))
      if (!method) return
      const path =
        '/' +
        propKey
          .substring(method.length)
          .replace(/([a-z])([A-Z])/g, '$1/$2')
          .replace(/\$/g, '/$/')
          .toLowerCase()
      return (...args) => {
        const finalPath = path.replace(/\$/g, () => args.shift())
        const queryOrBody = args.shift() || {}
        // You could use fetch here
        // return fetch(finalPath, { method, body: queryOrBody })
        console.log(method, finalPath, queryOrBody)
      }
    }
  }
)
// GET /
api.get()
// GET /users
api.getUsers()
// GET /users/1234/likes
api.getUsers$Likes('1234')
// GET /users/1234/likes?page=2
api.getUsers$Likes('1234', { page: 2 })
// POST /items with body
api.postItems({ name: 'Item name' })
// api.foobar is not a function
api.foobar()