const { User } = require('../models')
const JWT = require('../helpers/jwt')
const Bcrypt = require('../helpers/bcrypt')
const {OAuth2Client} = require('google-auth-library');

module.exports = class UserController {
  static async register(req, res, next) {
    try {
      let { email, password } = req.body
      let result = await User.create({ email, password})
      res.status(201).json({email: result.email, id: result.id})
    } catch (error) {   
      let msg = error.errors[0].message
      next({ msg, status: 400 })
    }
  }
  
  static async login(req, res, next) {
    try {
      let { email, password } = req.body
      email = email.toLowerCase()
      let data = await User.findOne({ where: { email }})
      if(!data) throw "Username/Password error"
      else {
        let result = Bcrypt.compare(password, data.password)
        if(!result) throw "Username/Password error dari result"
        else {
          let access_token = JWT.create({ id: data.id, email: data.email })
          console.log(access_token, 'dari result');
          res.status(200).json({ access_token })
        }
      }
    } catch (error) {
      next({ msg: error, status: 404})
    }
  }

  static async googleLogin(req, res, next) {
    try {
      let token = req.headers.id_token
      const client = new OAuth2Client(process.env.CLIENT_ID);
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID
      });
      const payload = ticket.getPayload();
      const found = await User.findOne({ where: { email: payload.email }})
      if(!found) {
        const data = await User.create({ email: payload.email, password: "disini" })
        const access_token = JWT.create({ id: data.id, email: data.email })
        res.status(200).json({ access_token })
      } else {
        const access_token = JWT.create({ id: found.id, email: found.email })
        res.status(200).json({ access_token })
      }
    } catch (error) {
      res.status(500).json({ msg: 'Internal server error'})
    }
  }
}