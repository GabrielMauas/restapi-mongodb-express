const jwt = require('jsonwebtoken');
const config = require('config');

const tokenVerif = (req, res, next) => {
    let token = req.get('Authorization');
    jwt.verify(token, config.get('tokenConfig.SEED'), (err, decoded) => {
        if(err) {
            return res.status(401).json( err.message );
        }
        req.user = decoded.user;
        next();
    })
}

module.exports = tokenVerif;