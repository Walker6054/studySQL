const nodemailer = require('nodemailer');
const config = require("../config");
const layouts = require("../mailer/mailLayout.json");

let transporter = nodemailer.createTransport({
    host: config[1].host,
    port: config[1].port,
    secure: config[1].secure,
    auth: {
        user: config[1].auth.user,
        pass: config[1].auth.pass
    },
});

exports.sendMail = async (email, login, mailLayout, other) => {
    let layout;
    let status;
    switch (mailLayout) {
        case "forgot":
            layout = layouts.forgot_password;
            layout.text = layout.helloStart + login;
            layout.text += layout.helloEnd;
            layout.text += layout.mainTextStart + other + layout.mainTextEnd;
            break;
        case "reg":
            layout = layouts.registration;
            layout.text = layout.helloStart + login;
            layout.text += layout.helloEnd;
            layout.text += layout.mainText;
            break;
        case "rec":
            layout = layouts.recovery_password;
            layout.text = layout.helloStart + login;
            layout.text += layout.helloEnd;
            layout.text += layout.mainText;
            break;
    }
    await transporter.sendMail({
        from: '"Study SQL" ' + config[1].mail,
        to: email,
        subject: layout.subject,
        text: '',
        html: layout.text
    })
        .then((res) => {
            console.log(res);
            status = true;
        })
        .catch((err) => {
            console.log(err);
            status = false;
        })
    return status;
};