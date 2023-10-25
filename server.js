import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import morgan from './morgan.js';
import cookieParser from "cookie-parser";
import compression from "compression";
import methodOverride from "method-override";
import nodemailer from 'nodemailer';
import { config } from "dotenv";
config()

const app = express();
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));
app.use(morgan.successHandler);
app.use(morgan.errorHandler);
app.use(cookieParser());
app.use(compression());
app.use(methodOverride());
app.use(cors({credentials:true}));


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Use environment variables instead of hardcoding
        pass: process.env.EMAIL_PASSWORD, // Use environment variables instead of hardcoding
    }
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
        `
        ,
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            res.status(500).json({code:500, error: 'Failed to send email' });
        } else {
            console.log('Email sent: ' + info.response);
            res.status(200).json({code:200,success: 'Email sent successfully' });
        }
    });
}

app.post('/contact', (req, res) => {
    sendEmail(req, res);
});

const PORT = process.env.PORT || 5000;

app.listen(process.env.PORT,()=>{
    console.log(`App listening on port ${PORT}`)
})