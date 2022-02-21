var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mongoDBmihai";
var http = require('http');





MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("mongoDBmihai");
    console.log("DB conn successful!");
    db.close();
  });


http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  console.log("Website live");
  res.end('Hello World! i am node js :3');
}).listen(8080);

