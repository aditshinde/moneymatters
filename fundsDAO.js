const https = require('https')
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";
const NAV_URL = 'https://www.amfiindia.com/spages/NAVAll.txt'

function update(callback){
    https.get(NAV_URL,(res)=>{
        let nav_data = '';
        res.on('error',(err)=>{
            callback(err);
        });
        res.on('data',(data)=>{
            nav_data += data.toString();        
        });
        res.on('end',()=>{
            lines = nav_data.split('\r\n');
            funds = []
            lines.forEach(line => {
                fund = {}
                if(line.trim()){
                    words = line.split(';')
                    fund['code'] = words[0]
                    fund['name'] = words[3]
                    fund['nav'] = words[4]
                    fund['date'] = words[5]
                    funds.push(fund);
                }
            });
            MongoClient.connect(url, function(err, db) {
                if (err) callback(err);
                const dbo = db.db("moneymatters");
                const today = new Date().toISOString().substr(0,10);
                dbo.collection("funds-"+today).drop();
                dbo.collection("funds-"+today).insertMany(funds, function(err) {
                    if (err) callback(err);
                    db.close();
                    callback(null);
                });
            });
        });
    });
}

module.exports = {update}