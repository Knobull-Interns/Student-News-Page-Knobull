const mongoose = require('mongoose')
const Schema = mongoose.Schema
const sha1 = require('sha1')
const rand = require('csprng')
// const Sequence = require('./sequence')

const UserSchema = new Schema(
  {
    name: String,
    password: String,
    salt: String, // 使用csprng随机生成的盐
    userType: Number,
    avatar: String,
    collectArticle: Array,
    collectComment: Array
  },
  { versionKey: false }
)

const CategorySchema = new Schema(
  {
    name: String
  },
  { versionKey: false }
)

const ArticleSchema = new Schema(
  {
    title: String,
    desc: String,
    categoryId: {
      ref: 'Category',
      type: Schema.Types.ObjectId
    },
    charge: Number,
    banner: String,
    content: String,
  },
  { versionKey: false }
)

const PaySchema = new Schema(
  {
    userId: String,
    articleId: String
  },
  { versionKey: false }
)

const Models = {
  User: mongoose.model('User', UserSchema),
  Article: mongoose.model('Article', ArticleSchema),
  Category: mongoose.model('Category', CategorySchema),
  Pay: mongoose.model('Pay', PaySchema)
}

// 初始化数据
const initialize = () => {
  console.log('beginning to initialize data...')
  Models.User.find({}, (err, doc) => {
    if (err) {
      console.log(err)
      console.log('initialize failed')
    } else if (!doc.length) {
      const salt = rand(160, 36)
      // 第一次创建站长账户
      new Models['User']({
        name: 'admin',
        password: sha1('123456' + salt),
        salt: salt,
        userType: 1,
        avatar: 'https://demo.buildadmin.com/static/images/avatar.png'
      }).save()
      console.log('initialize successfully')
    } else {
      console.log('initialize successfully')
    }
  })
}

mongoose.connect('mongodb://127.0.0.1:27017/news')

const db = mongoose.connection

db.on('error', console.error.bind(console, 'Database connection error.'))
db.once('open', () => {
  console.log('The database has connected.')
  initialize()
})

module.exports = Models
