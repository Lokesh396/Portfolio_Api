const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const cron = require("node-cron");

dotenv.config();
const app = express();
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));
app.use(cors({ credentials: true }));

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Use environment variables instead of hardcoding
    pass: process.env.EMAIL_PASSWORD, // Use environment variables instead of hardcoding
  },
});

function sendEmail(req, res) {
  const { name, email, message } = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.RECIEVER_MAIL,
    subject: `You got a message from ${name}`,
    html: `<h4>Hello, Someone Contacted you through contact Form</h4>
        <h4>Name: ${name}</h4>
        <h4>Email: ${email}</h4>
        <p>Message: ${message}</p>
        `,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.status(500).json({ code: 500, error: "Failed to send email" });
    } else {
      console.log("Email sent: " + info.response);
      res.status(200).json({ code: 200, success: "Email sent successfully" });
    }
  });
}

function sendMorningMail() {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.RECIEVER_MAIL,
    subject: `Morning Motivation`,
    html: `<h4>Affirmations</h4>
    <ul>
      <li>I am a Champion</li>
      <li>It is easy to learn DSA</li>
      <li>I will achieve 30 lpa for next year</li>
      <li>Nothing is difficult for me to achieve</li>
      <liI will complete the work todayli>
      <li>I breath confidence and I release hatred, bad thoughts</li>
    </ul>
    <h4>Personal Constitution</h4>
      <h3>
        At work
      </h3>
      <ul>
        <li>Always listen carefully to others, reply with a smile</li>
        <li>Don't hesitate to help others</li>
        <li>Work prior to doing personal stuff</li>
        <li>Be on time, leave on time</li>
      </ul>
      <h3>Personal</h3>
      <ul>
        <li>Eat Healthy don't eat junk food</li>
        <li>Do exercise properly, don't fool yourself</li>
        <li>Bath with cold water in the morning and hot water in the evening</li>
        <li>Don't bite nails</li>
        <li>Wear good clothes</li>
      </ul>
      <h3>Professinal
      </h3>
      <ul>
        <li>Try to be productive, learn new things related to your work</li>
        <li>Always keep team before yourself</li>
        <li>Don't procrastinate the tasks that need to be done today</li>
        <li>Don't blindly copy the code, make sure to understand before using</li>
        <li>Behave like a professional, respect your colleagues</li>
      </ul>
        `,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.status(500).json({ code: 500, error: "Failed to send email" });
    } else {
      console.log("Email sent: " + info.response);
      res.status(200).json({ code: 200, success: "Email sent successfully" });
    }
  });
}

cron.schedule("59 5 * * *", sendMorningMail, {
  scheduled: true,
  timezone: "IST",
});

app.get("/", (req, res) => {
  res.send("This is my api running!");
});

app.post("/contact", (req, res) => {
  sendEmail(req, res);
});

const PORT = process.env.PORT || 5000;

app.listen(process.env.PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
