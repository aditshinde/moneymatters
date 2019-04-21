const API_KEY = require('../env.js').API_KEY;
const sgMail = require('@sendgrid/mail');
const fs = require('fs');
sgMail.setApiKey(API_KEY);

function sendMailWithAttachments({to,from,subject,text,html,attachments},callback){
  const msg = {
    to,
    from,
    subject,
    text,
    html,
    attachments
  };
  sgMail.send(msg).then((res)=>{
    callback(null,res);
  })
  .catch((err)=>{
    callback(err,null);
  });
}

module.exports = {
  sendMailWithAttachments
}

// sendMailWithAttachments({
//   to: 'aditdineshshinde@gmail.com',
//   from: 'aditdineshshinde@gmail.com',
//   subject: 'Money Matters',
//   text: 'Please find your details in the file attached.',
//   html: '<strong>Please find your details in the file attached.</strong>',
//   attachments: [{
//     filename: 'aditshinde.csv.gz',
//     content: fs.readFileSync('../public/download/aditshinde.csv.gz').toString('base64')
//   }]
// });