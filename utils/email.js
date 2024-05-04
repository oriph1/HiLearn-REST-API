const nodemailer = require('nodemailer');

const sgMail = require('@sendgrid/mail');

const sendEmail = async (options) => {
  //Fake Emails
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // 2) Define the email options
  const mailOptions = {
    from: 'Jonas schmedtmann <hello@jonas.io>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html:
  };
  // 3) send the email
  await transporter.sendMail(mailOptions);

  //
  //Real email Option (With Gmail)

  // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  // const msg = {
  //   to: options.email,
  //   from: process.env.EMAILֹ_REAL_USERNAME,
  //   subject: 'Sending with SendGrid is Fun',
  //   text: 'and easy to do anywhere, even with Node.js',
  //   html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  // };
  // await sgMail.send(msg);
  console.log('Email Sent');
};

module.exports = sendEmail;
