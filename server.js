const express = require("express");
const expressSession = require('express-session');
const bcrypt = require('bcrypt-nodejs');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const configRoutes = require("./routes");
const app = express();
const static = express.static(__dirname + '/public');
const session = require('express-session')
const passport = require('passport')
var flash = require("connect-flash");
app.use(flash());
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars');
// //wkhtmlpdf
// const wkhtmlpdf = require('wkhtmlpdf');
// const fs = require('fs');

// // URL      get the pdf file
// wkhtmltopdf('http://localhost:3000/recipes', { pageSize: 'letter' })
//   .pipe(fs.createWriteStream('out.pdf'));

const handlebarsInstance = exphbs.create({
    defaultLayout: 'main',
    // Specify helpers which are only registered on this instance.
    helpers: {
        asJSON: (obj, spacing) => {
            if (typeof spacing === "number")
                return new Handlebars.SafeString(JSON.stringify(obj, null, spacing));

            return new Handlebars.SafeString(JSON.stringify(obj));
        }
    },
    partialsDir: [
        'views/partials/'
    ]
});

const rewriteUnsupportedBrowserMethods = (req, res, next) => {
    // If the user posts to the server with a property called _method, rewrite the request's method
    // To be that method; so if they post _method=PUT you can now allow browsers to POST to a route that gets
    // rewritten in this middleware to a PUT route
    if (req.body && req.body._method) {
        req.method = req.body._method;
        delete req.body._method;
    }

    // let the next middleware run:
    next();
};

app.use("/public", static);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.engine('handlebars', handlebarsInstance.engine);
app.set('view engine', 'handlebars');

//Passport
app.use(session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());

configRoutes(app);

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log("Your routes will be running on http://localhost:3000");
});