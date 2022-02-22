// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://alemihai25:Motadev123$@mihai.ch81p.mongodb.net/mihai?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//   const collection = client.db("mydb").collection("users");
//   // perform actions on the collection object
  
  
//   var dbo = db.db("mydb");
//   var myobj = { name: "Some_Guy", address: "Highway 37", age: "69" };
//   dbo.collection("users").insertOne(myobj, function(err, res) {
//     if (err) throw err;
//     console.log("1 document inserted");
//     db.close();
//   });

//   client.close();
// });

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://alemihai25:Motadev123$@mihai.ch81p.mongodb.net/mihai?retryWrites=true&w=majority";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mydb");
  var myobj = { name: "Some_Guy", address: "Highway 37", age: "69" };
  dbo.collection("users").insertOne(myobj, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
    db.close();
  });
});