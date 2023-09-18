import nodemailer from 'nodemailer';
require("dotenv").config();

export default async (req, res) => {
  if (req.method === 'POST') {
    const { name, email, message } = req.body;

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PW
      },
    });

    const mailOptions = {
      from: email,
      to: process.env.EMAIL, // Change to your email address
      subject: 'New Contact Form Submission',
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    try {
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error sending email.' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed.' });
  }
};
