module.exports = (err, req, res, next) => {
  console.log(err);
  if (err.name === 'SequelizeValidationError') {
    err.msg = err.errors.map(el => {
      return el.message
    })
    err.msg = err.msg.join(", ")
  }
  let msg = err.msg || 'Internal server error'
  let status = err.status || 500
  res.status(status).json({msg})
}