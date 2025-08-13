const jwt = require("jsonwebtoken");
const User = require("../Models/User");

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
       // console.log("AUTH HEADER:", req.headers.authorization);
        try {
            token = req.headers.authorization.split(" ")[1];
            if (!token) {
                return res.status(401).json({ message: "Not authorized, token missing" });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.user.id).select("-password"); // Exclude password 

            next();
        } catch (error) {
            console.error("Token verification failed", error);
            return res.status(401).json({ message: "Not authorized, token failed" });
        }
    } else {
        return res.status(401).json({ message: "Not authorized, no token provided" });
    }
};

//Middleware to check if user is an admin
const admin = async (req,res,next) =>{
    if(req.user && req.user.role === "admin"){
        next();
    }else{
        return res.status(403).json({ message: "Unauthorized, you are not an admin" });
    }
}

module.exports = { protect,admin };
