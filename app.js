const dotenv = require('dotenv');
dotenv.config();
// constants
const SERVER_NAME = '\x1b[34m[Mihai-Server]\x1b[0m';
// const err = console.log("DB conn \x1b[31mfailed!\x1b[0m");  // ill use later
const MongoClient = require('mongodb').MongoClient;
const URLDB = process.env.URLDB;
// const http = require('http');
const express = require('express');     // 1/2 required to get the server
const app = express();                  //  2/2
const bcrypt = require('bcrypt'); // pass encryption

//|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?//
//|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|   danger - testing grounds     LOL ?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?//
//|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?//
var DBresults = undefined;

MongoClient.connect(URLDB, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mydb");
  dbo.collection("users").find().toArray(function(err, result) {
    if (err) throw err;
    DBresults = result;
    db.close();
  });
});
//|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?//
//|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?   danger - testing grounds     LOL ?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?//
//|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?//

app.set('view engine', 'ejs'); // set the view engine to ejs
app.use(express.urlencoded({extended: false}));

// use res.render to load up an ejs view file //
// registrer page
app.get('/register', (req, res) => {
  console.log("Rendering \x1b[34m[index.ejs]\x1b[0m");
  res.render('pages/register.ejs')
})

app.post('/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    MongoClient.connect( URLDB, function(err, db) {
      if (err) throw err;
      var dbo = db.db("mydb");
      var myobj = { name: req.body.name, email: req.body.email, password: hashedPassword };
      dbo.collection("users").insertOne(myobj, function(err, res) {
        if (err) throw err;
        console.log("1 document inserted");
        db.close();
      });
    });
    res.redirect('/login')
  } catch {
    res.redirect('/register')
  }
  // console.log(users);
});

// login page
app.get('/login', (req, res) => {
  console.log("Rendering \x1b[34m[index.ejs]\x1b[0m");
  res.render('pages/login.ejs')
})
app.post('/login', async (req, res) => {
  try {
    var email2 = req.body.email;
    var password = req.body.password;
    // const hashedPassword = await bcrypt.hash(req.body.password, 10);

    console.log(email2);
    console.log("lookin into the database");
    var hashedPassword2 = 1;
    MongoClient.connect(URLDB, function(err, db) {
      if (err) throw err;
      var dbo = db.db("mydb");
      dbo.collection("users").findOne({ email: email2}, function(err, result) {
        if (err) throw err;
        db.close();
        hashedPassword2 = result["password"];

        console.log("COMPARE : ", password, "to", hashedPassword2)

        (async () => {
          const result1 = await bcrypt.compare(password, hashedPassword2);
          // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<------------------------------------------------------------------------------------------------------------
          })();
        
        // const result1 = bcrypt.compare(password, hashedPassword2, function (err, res) {
        //   if (res) {
        //     console.log("YES")
        //     
        //   } else {
        //     console.log("NO")
        //     
        //   }
        // })
      });
    });
    res.redirect('/data');
  } catch {
    res.redirect('/about');
  }
});

// home page
app.get('/', (req, res) => {
  console.log("Rendering \x1b[34m[index.ejs]\x1b[0m");
  res.render('pages/index.ejs', { name: 'Mihai'})
})

// data page
app.get('/data', function(req, res) {
  var mascots = DBresults;
  var tagline = "No programming concept is complete without a cute animal mascot.";  // local variable
  console.log("Rendering \x1b[34m[data.ejs]\x1b[0m");
  res.render('pages/data.ejs', {
    mascots: mascots,
    tagline: tagline
  });
});
// about page
app.get('/about', function(req, res) {
  console.log("Rendering \x1b[34m[about.ejs]\x1b[0m");
  res.render('pages/about.ejs');
});

MongoClient.connect(URLDB, function(err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    console.log("DB conn \x1b[32msuccessful!\x1b[0m");
    db.close();
});

app.listen(process.env.PORT);
console.log(SERVER_NAME+' is \x1b[32monline\x1b[0m on port '+process.env.PORT+'.');