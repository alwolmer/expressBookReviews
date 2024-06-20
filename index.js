const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

let users = []

const doesExist = (username) => {
    const filtered = users.filter((user) => {
        return user.username === username
    })

    return filtered.length //if zero, will be interpreted as a falsy value
}

const isAuthentic = (username, password) => {
    const validUser = users.filter((user) => {
        return (user.username === username && user.password === password)
    })

    return validUser.length
}

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next) {
    if (!req.session.authorization) {
        return res.status(403).json({message: "User not logged in"})
    } else {
        const token = req.session.authorization['accessToken']
        // 'access' stands in for a secret key
        jwt.verify(token, 'access', (err, user) => {
            if(err) {
                return res.status(403).json({message: "User not authenticated"})
            } else {
                req.user = user
                next() //goes to the endpoint to which the request was destined
            }
        })
    }
});

app.post("/register", (req, res) => {
    const username = req.body.username
    const password = req.body.password

    if (!username || !password) {
        return res.status(404).json({message: "Unable to register user (missing parameters)"})
    } else if (doesExist(username)) {
        return res.status(404).json({message: "User with username already exists"})
    } else {
        const newUser = {
            "username": username,
            "password": password
        }
        users.push(newUser)
        return res.status(200).json(newUser)
    }
})

app.post("/login", (req, res) => {
    const username = req.body.username
    const password = req.body.password

    if (!username || !password) {
        return res.status(404).json({message: "Unable to login user (missing parameters"})
    } else if (!isAuthentic(username, password)) {
        return res.status(404).json({message: "Invalid login. Check username and password"})
    } else {
        // 'access' stands in for a secret key
        const accessToken = jwt.sign({
            data: password
        }, 'access', {expiresIn: 60 * 60})

        console.log(req.session)

        // this is server-side token management, I think
        req.session.authorization = {
            accessToken,
            username
        }

        return res.status(200).json({message: `User ${username} succesfully logged in`})
    }
})
 
const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log(`Server running on port ${PORT}`));
