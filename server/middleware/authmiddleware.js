const jwt = require("jsonwebtoken");


module.exports = function (req, res, next) {
    //get the token from the header
    const token = req.headers['authorization'].split(' ')[1]
    console.log(token)
    // check if not token
    if (!token) {
        return res.status(400).json({ msg: "No Token, Authorization denied" });
    }
    try {
        const decoded = jwt.verify(token, "process.env.SECRETKEY");
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: "Token is not valid" });
    }
};