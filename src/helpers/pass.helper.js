const bcrypt = require('bcrypt')

function HashPassword(password) {
    const saltRounds = 1
    const salt = bcrypt.genSaltSync(saltRounds)
    const hash = bcrypt.hashSync(password, salt)
    return hash
}

function ComparePassword(password, HashPassword) {
    const compare = bcrypt.compareSync(password, HashPassword)
    return compare

}

module.exports = { HashPassword, ComparePassword }