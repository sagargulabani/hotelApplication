// Get dependencies
const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const db = require('./server/db.js');
const cookieParser = require('cookie-parser');


// Get our API routes
const api = require('./server/routes/api');

const app = express();

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());

// Point static path to dist

// app.use(function (req,res,next) {
//
//     console.log("Reached authentication");
//
//     if (req.cookies.loggedIn == "true") {
//       next();
//     }
//     else if (req.body.username && req.body.password && req.body.username == 'harish' && req.body.password == 'harish123') {
//         res.cookie('loggedIn','true', {maxAge:1*60*60*1000});
//         res.writeHead(302, {
//           'Location':'/'
//         });
//         res.end();
//     }
//     else {
//       console.log("Returning html");
//         return res.send('<form method = "POST" action = "/"><input type = "text" name = "username"><input type = "password" name = "password"><input type = "submit" name = "submit" value = "submit"></form>')
//       }
//     });


app.use(express.static(path.join(__dirname, 'dist')));

// Set our api routes




app.use('/api', api);

// Catch all other routes and return the index file
app.get('*', (req, res) => {

  console.log("This is also hit");
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3000';
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`API running on localhost:${port}`));
