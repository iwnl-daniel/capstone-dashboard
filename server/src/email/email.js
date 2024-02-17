const nodemailer = require('nodemailer');
require('dotenv').config();

/* The function sends an update about a change in a todo list task.
   Currently, it will send to all users subscribed to the current project.
   It will notify in the subject the project name and task */
/**
 * sendEmail -
 * @param {Array<String>} emailList
 * @param {String} projectName
 * @param {String} message
 */
async function sendEmail(emailList, projectName, message) {
  const user = process.env.EMAIL_USER;
  const pass = process.env.AUTH_EMAIL_PASS;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: user,
      pass: pass,
    },
  });

  const options = {
    from: user,
    to: emailList,
    subject: `Project: ${projectName} update notice`,
    text: message,
  };

  try {
    return await transporter.sendMail(options);
  } catch (err) {
    return err;
  }
}
module.exports = { sendEmail };
