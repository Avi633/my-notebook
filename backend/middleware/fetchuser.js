const jwt = require("jsonwebtoken");

// secret token
const JWT_SECRET = 'Mynameis@prince25';

const fetchuser = (req, res, next) => {
    // get user from jwt token and add id to req object
    const token = req.header('auth-token');
    if(!token){
        return  res.status(401).send({error: "Please authenticate using a valid!"});
    }

    try{
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    next()
    } catch (error) {
        return  res.status(401).send({error: "Please authenticate using a valid!"});
    }
}

module.exports = fetchuser;