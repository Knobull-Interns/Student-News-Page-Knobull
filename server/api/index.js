const article = require('./article.js')
const draft = require('./draft.js')
const tag = require('./tag.js')
const login = require('./login')
const user = require('./user')
const category = require('./category')

module.exports = (app) => {
    app.use(article)
    app.use(draft)
    app.use(tag)
    app.use(login)
    app.use(user)
    app.use(category)
}