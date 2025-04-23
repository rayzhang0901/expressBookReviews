const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
    const authHeader = req.headers.authorization || '';
    const headerToken = authHeader.startsWith('Bearer ')
        ? authHeader.slice(7).trim()
        : null;

    const token = headerToken || req.session.token;

    if (!token) {
        return res.status(401).json({message: 'Access denied. No token provided.'})
    }

    const secret = process.env.JWT_SECRET || 'fingerprint_customer';
    try {
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        return next();
    } catch (err) {
        return res.status(400).json({ message: 'Invalid token.', error: err.message})
    }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
