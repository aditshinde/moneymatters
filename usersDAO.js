const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";
const DBNAME = "moneymatters";


function findUser(username,callback){
    MongoClient.connect(url,(err, db)=>{
        if (err){callback(err,null);}
        const dbo = db.db(DBNAME);
        dbo.collection("users").findOne({'_id':username},(err,user)=>{
            if(err){callback(err,null)}
            callback(null,user);
            db.close();
        });
    });
}

function updateFundsForUser({username,funds},callback){
    MongoClient.connect(url,(err, db)=>{
        if (err){callback(err,null);}
        const dbo = db.db(DBNAME);
        dbo.collection("users").updateOne({'_id':username},{$set:{'funds':funds}},(err,user)=>{
            if(err){callback(err,null)}
            callback(null,user);
            db.close();
        });
    });
}

module.exports = {findUser,updateFundsForUser}