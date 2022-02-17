const nodemailer = require('nodemailer');
const config = require("../config/mailer/config.json");
const layouts = require("../mailer/mailLayout.json");

let transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
        user: config.auth.user,
        pass: config.auth.pass
    },
});

exports.sendMail = async (email, login, mailLayout, other) => {
    let layout;
    switch (mailLayout) {
        case "forgot":
            layout = layouts.forgot_password;
            layout.text = layout.helloStart + login;
            layout.text += layout.helloEnd;
            layout.text += layout.mainTextStart + other;
            layout.text += layout.mainTextEnd;
            break;
        case "reg":
            layout = layouts.registration;
            layout.text = layout.helloStart + login;
            layout.text += layout.helloEnd;
            layout.text += layout.mainText;
            break;
    }
    await transporter.sendMail({
        from: '"Study SQL" ' + config.mail,
        to: email,
        subject: layout.subject,
        text: '',
        html: layout.text
    })
        .then((res) => {
            console.log(res);
        })
        .catch((err) => {
            console.log(err);
        })
};