if ( process.env.NODE_ENV !== 'developer' ) {
  console.log("\x1b[36m--Developer mode activated--\x1b[0m")
  require('dotenv').config()
}
// const err = console.log("DB conn \x1b[31mfailed!\x1b[0m");  // ill use later

const methodOverride = require('method-override')
const flash = require('express-flash')
const session = require('express-session')
const passport = require('passport')
const bcrypt = require('bcrypt') // pass encryption
const SERVER_NAME = '\x1b[34m[Mihai-Server]\x1b[0m'
const MongoClient = require('mongodb').MongoClient
const URLDB = process.env.URLDB
const express = require('express')     // 1/2 required to get the server
const app = express()                  //  2/2
const initializePassport = require('./passport-config')
// initializePassport(passport, email => users.find(user => user.email === email))
initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
)

  // <<<<<<<<<<<<<<--------------------      <<<<<<<<<<<<<<--------------------      <<<<<<<<<<<<<<--------------------      <<<<<<<<<<<<<<--------------------      <<<<<<<<<<<<<<--------------------      <<<<<<<<<<<<<<--------------------      
//|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?//
//|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|   danger - testing grounds     LOL ?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?//
//|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?|?//
var DBresults = undefined

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
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

// use res.render to load up an ejs view file //
// registrer page
app.get('/register', checkNotAuthenticated, (req, res) => {
  console.log("Rendering \x1b[34m[register.ejs]\x1b[0m");
  res.render('pages/register.ejs')
})

app.post('/register', checkNotAuthenticated, async (req, res) => {
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
});

// login page
app.get('/login', checkNotAuthenticated, (req, res) => {
  console.log("Rendering \x1b[34m[login.ejs]\x1b[0m");
  res.render('pages/login.ejs')
})
app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))


// app.post('/login', async (req, res) => {
//   try {
//     var email2 = req.body.email;
//     var password = req.body.password;
//     // const hashedPassword = await bcrypt.hash(req.body.password, 10);

//     console.log(email2);
//     console.log("lookin into the database");
//     var hashedPassword2 = 1;
//     MongoClient.connect(URLDB, function(err, db) {
//       if (err) throw err;
//       var dbo = db.db("mydb");
//       dbo.collection("users").findOne({ email: email2}, function(err, result) {
//         if (err) throw err;
//         db.close();
//         hashedPassword2 = result["password"];
//         console.log("COMPARE : ", password, "to", hashedPassword2)
//         // const result1 = await bcrypt.compare(password, hashedPassword2);
//         var whatis = bcrypt.compareSync(password, hashedPassword2);
//         if (whatis == true) {
//           console.log("F TRUE")
//           res.redirect('/data');
//         } else {
//           console.log("FALSE")
//           res.redirect('/login');
//         }
//       });
//     });
//   } catch {
//   }
// });

// home page
app.get('/', checkAuthenticated, (req, res) => {
  console.log("Rendering \x1b[34m[index.ejs]\x1b[0m");
  res.render('pages/index.ejs', { name: req.user.name })
})
app.get('/index', checkAuthenticated, (req, res) => {
  console.log("Rendering \x1b[34m[index.ejs]\x1b[0m");
  res.render('pages/index.ejs', { name: req.user.name})
})

// data page
app.get('/data', checkAuthenticated, function(req, res) {
  var mascots = DBresults;
  var tagline = "No programming concept is complete without a cute animal mascot.";  // local variable
  console.log("Rendering \x1b[34m[data.ejs]\x1b[0m");
  res.render('pages/data.ejs', {
    mascots: mascots,
    tagline: tagline
  });
});
// about page
app.get('/about', checkAuthenticated, function(req, res) {
  console.log("Rendering \x1b[34m[about.ejs]\x1b[0m");
  res.render('pages/about.ejs');
});

app.delete('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
})

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}

MongoClient.connect(URLDB, function(err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    console.log("DB conn \x1b[32msuccessful!\x1b[0m");
    db.close();
});

app.listen(process.env.PORT);
console.log(SERVER_NAME+' is \x1b[32monline\x1b[0m on port '+process.env.PORT+'.');