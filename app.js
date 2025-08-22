const express = require("express");
const connectDB = require("./db");
const app = express();
const jwt = require("jsonwebtoken");
const {Product} = require("./models/ProductModel");
const User = require("./models/UserModel");

app.use(express.json());

connectDB();

const PORT = 3000;

app.get("/", (req, res)=>{
    res.status(200).json({
        message: "server is working"
    });
});


const isAuthenticated = async(req, res, next) =>{
    try {
        const token = req.header('x-auth-token');
        if (!token) res.status(401).json({message:"unauthorized user"});
    
        const user = jwt.verify(token, "secret_key");
        if (!user) res.status(401).json({message:"unauthorized user"});
    
        req.user = user;
        next();
    } catch (error) {
        console.error(error.message);
        return res.status(401).json({message:"uunauthorized user"});
    }

}


// app.use("/api", isAuthenticated);

// register user
app.post("/api/users", async(req,res)=>{
 try {
    const {name, email, password} = req.body;

    let user  = await User.findOne({email});
    if (user) {
         return res.status(200).json({
            message: "user already exists",
        });
    }

    user = new User({
        name,
        email,
        password
    });
    await user.save();  

    const payload = {
        user : {
            id : 1234,
        }
    };

    const jwtToken = jwt.sign(payload, "secret_key", {expiresIn: '1h'}, (err, token)=>{
        if (err) throw err;
    });
    return res.status(201).json({
        message: "user created successfully",
        jwtToken
    });
 } catch (error) {
    console.error(error.message);
    return res.status(500).json({
        message: error.message || "Internal server error",
    });
 };
});

app.post("/api/login", async(req,res)=> {
    const {email, password} = req.body;
    try {
        const user = await User.findOne({email});
        if (!user) { 
            return res.status(404).json({
                message:"User doesn't exist"
            });
        }
        const authenticated = await user.comparePassword(password);
        if (!authenticated) {
            return res.status(400).json({
                message:"Incorrect password"
            });
        }
        const payload = {
            user: {
                id: 1234
            }
        };

       const  webToken = jwt.sign(payload, "secret_key");
        return res.status(200).json({
            webToken
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            message: error.message || "Internal server error",
        });
    }
})

app.listen(PORT, ()=> {
    console.log("server is running fine");
})