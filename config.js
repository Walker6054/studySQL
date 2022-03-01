let config = new Array();
config[0] = {
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    connectionLimit: process.env.DB_LIMIT
}

config[1] = {
    host: process.env.MAILER_HOST,
    port: "465",
    secure: true,
    auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASS
    },
    mail: process.env.MAILER_MAIL
}

module.exports = config;