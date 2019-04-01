const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";
const fs = require('fs');

function update(callback){
    MongoClient.connect(url, function(err, db) {
        if (err) callback(err);
        var dbo = db.db("moneymatters");
        fs.readFile('./nav.json',(err,data)=>{
            if(err){
                callback(err);      
            }
            dbo.collection("funds").insertMany(data.toString(), function(err) {
                if (err) callback(err);
                db.close();
            });
        });
      });
}

module.exports = {update};