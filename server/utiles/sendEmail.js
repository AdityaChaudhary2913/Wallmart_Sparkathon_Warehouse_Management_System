const nodemailer = require('nodemailer');

const sendEmail = async (subject, messageBody, send_to, sent_from, reply_to) => {
    // Create email transporter
    const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: 587,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    // HTML email template
    const message = `
        <!DOCTYPE html>
        <html lang="en">

        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Contact Us Form Submission</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }

                .email-container {
                    background-color: #ffffff;
                    margin: 2rem auto;
                    padding: 2rem;
                    border-radius: 8px;
                    max-width: 600px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }

                .email-header {
                    text-align: center;
                    margin-bottom: 2rem;
                }

                .email-header h1 {
                    margin: 0;
                    color: #333333;
                }

                .email-body {
                    color: #333333;
                    line-height: 1.6;
                    margin-bottom: 2rem;
                }

                .email-footer {
                    text-align: center;
                    color: #777777;
                    font-size: 0.875rem;
                    margin-top: 2rem;
                    border-top: 1px solid #dddddd;
                    padding-top: 1rem;
                }

                .email-footer a {
                    color: #4CAF50;
                    text-decoration: none;
                }

                .contact-info {
                    margin-bottom: 1rem;
                }

                .contact-info p {
                    margin: 0.5rem 0;
                }

                .message-content {
                    background-color: #f9f9f9;
                    padding: 1rem;
                    border-radius: 4px;
                    white-space: pre-wrap;
                }
            </style>
        </head>

        <body>
            <div class="email-container">
                <div class="email-header">
                    <h1>Contact Us Form Submission</h1>
                </div>

                <div class="email-body">
                    <p>Dear Admin,</p>
                    <p>You have received a new message from the contact us form on your website. Here are the details:</p>

                    <div class="contact-info">
                        <p><strong>Email:</strong> ${sent_from}</p>
                    </div>

                    <div class="message-content">
                        <p><strong>Message:</strong></p>
                        <p>${messageBody}</p>
                    </div>
                </div>

                <div class="email-footer">
                    <p>&copy; 2024 Your Company. All rights reserved.</p>
                    <p><a href="#">Privacy Policy</a></p>
                </div>
            </div>
        </body>

        </html>
    `;

    // Create email options
    const mailOptions = {
        from: sent_from,
        to: send_to,
        replyTo: reply_to,
        subject: subject,
        html: messageBody ? messageBody : message
    };

    // Send email
    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log(err);
        } else {
            console.log(info);
        }
    });
};

module.exports = sendEmail;
