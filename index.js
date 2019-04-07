/*
Create a lightweight webserver that can handle REST API calls
for loading and viewing funds
*/
const app = require('fastify')({
    logger: true
});
const fs = require('fs');
const fundsDAO = require('./fundsDAO.js');
const usersDAO = require('./usersDAO.js');

app.get('/', async (request, reply) => {
  return { "statusCode":200, "error":null, "message":"Welcome to Money Matters", data: null }
});

app.get('/mf/view/:date', (req, res) => {
    fundsDAO.findAllForDate(req.params.date,(err,funds)=>{
        if(err){
            console.log(err);
            res.send({ "statusCode":500, "error":"NAV data not found", "message":null, data: null });
        }
        res.send({ "statusCode":200, "error":null, "message":"NAV data", data: funds});
    });
});

app.get('/mf/stats/:user',(req,res)=>{
    username = req.params.user
    usersDAO.findUser(username,(err,user)=>{
        if(err){
            console.log(err);
            res.send({ "statusCode":500, "error":"User data not found", "message":null, data: null });
        }
        const today = new Date().toISOString().substr(0,10);
        if((user.mfValueDate && user.mfValueDate === today) || !user.funds || user.funds.length==0){
            res.send({ "statusCode":200, "error":null, "message":"User data", data: user});
        }
        else{
            fundCodes = []
            user.funds.forEach(fund => {
                fundCodes.push(fund.code);
            });
            fundsDAO.findByIdsForDate({'ids':fundCodes},(err,funds)=>{
                if(err){
                    console.log(err);
                    res.send({ "statusCode":500, "error":"User data not found", "message":null, data: null });
                }
                if(!funds || (funds && funds.length == 0 )){
                    res.send({ "statusCode":200, "error":null, "message":"User data", data: user});
                }
                else{
                    currValueFunds = []
                    user.funds.forEach(fund => {
                        for (let i = 0; i < funds.length; i++) {
                            const tmp = funds[i];
                            if(fund.code == tmp._id){
                                fund['currNav'] = tmp.nav;
                                fund['oldValue'] = fund['oldNav'] * fund['units'];
                                fund['currValue'] = fund['currNav'] * fund['units'];
                                fund['pnl'] = fund['currValue'] - fund['oldValue'];
                                fund['change'] = ( fund['pnl'] / fund['oldValue'] ) * 100;
                                currValueFunds.push(fund);
                            }                    
                        }
                    });
                    user.funds = currValueFunds;
                    //TODO: add valuation date to limit number of calls to db
                    usersDAO.updateFundsForUser({username,'funds':currValueFunds},(err,result)=>{
                        if(err){
                            console.log(err);
                            res.send({ "statusCode":500, "error":"User data not found", "message":null, data: null });
                        }
                        res.send({ "statusCode":200, "error":null, "message":"Valuation data", data: user});
                    });
                }
            });
        }
    });
});

app.get('/mf/update',(req,res)=>{
    fundsDAO.update((err)=>{
        if(err){
            console.log(err);
            res.send({ "statusCode":500, "error":"NAV data update failed", "message":"NAV data update failed", data: null })
        }
        else{
            res.send({ "statusCode":200, "error":null, "message":"NAV data updated", data: null });
        }
    });
});

const start = async () => {
  try {
    await app.listen(3000)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}
start()