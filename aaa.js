const dotenv = require('dotenv');
dotenv.config();

var name2 = "mihai";
var email2 = "mihaimihai@mihai";
var hashedPassword = "mihaimihai";

var MongoClient = require('mongodb').MongoClient;
var url = process.env.URLDB;

MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    var myobj = { name: name2, email:email2, password: hashedPassword };
    dbo.collection("users").insertOne(myobj, function(err, res) {
      if (err) throw err;
      console.log("1 document inserted");
      db.close();
    });
  });