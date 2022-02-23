var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mongoDBmihai";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mongoDBmihai");
  dbo.collection("customers").find({}, { projection: {} }).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
    console.log(result[2].address, "aaaaaaa"); // Return the address of the third document
    db.close();
    
  });
});