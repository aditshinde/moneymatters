const app = require('fastify')({
    logger: true
});
const fs = require('fs');

app.get('/', async (request, reply) => {
  return { "statusCode":200, "error":null, "message":"Welcome to Money Matters", data: null }
});

app.get('/nav/view', (request, reply) => {
    fs.readFile('./nav.json',(err,data)=>{
        if(data){
            reply.send({ "statusCode":200, "error":null, "message":"NAV data", data: data.toString() });
        }
        reply.send({ "statusCode":500, "error":"NAV data not found", "message":"NAV data not found", data: null });
    });
});

app.get('/nav/load',(req,res)=>{
    const { exec } = require('child_process');
    exec('python nav_scraper.py', (error, stdout, stderr) => {
    if (error) {
        console.error(`exec error: ${error}`);
        return;
    }
    console.log(`stderr: ${stderr}`);
    if(!stderr){
        res.send({ "statusCode":200, "error":"NAV data loaded", "message":"NAV data loaded", data: null });
    }
    else{
        res.send({ "statusCode":500, "error":"NAV data loading failed", "message":"NAV data loading failed", data: null })
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