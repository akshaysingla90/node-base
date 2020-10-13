const path = require('path');
const PLATFORM = process.env.PLATFORM || 'humble-minor'
module.exports = {
    PLATFORM,
    root: path.normalize(__dirname + '/../app'),
    theme: PLATFORM + '/us',
    mongoUri: 'mongodb://localhost:27017/humble-minor',
    adminEmail: 'admin@admin.com',
    host: 'helendomain.com',
    SENDGRID_API_KEY: 'CHANGEME',
    show: function () {
        console.log('environment: ' + this.environment);
    },
    SENDINBLUE: {
        API_KEY: 'dummy',
        SENDER_EMAIL: 'contact@demo.in'
    },
    SMTP: {
        TRANSPORT: {
            host: process.env.NODEMAILER_HOST || `node-mailer-host-name`,
            service: process.env.NODEMAILER_SERVICE || `node-mailer-service`,
            auth: {
                user: process.env.NODEMAILER_USER || `node-mailer-user`,
                pass: process.env.NODEMAILER_PASSWORD || `node-mailer-password`
            },
            secure: false,
            tls: { rejectUnauthorized: false },
        },
        SENDER: 'HM <humble-minor@demo.co.in>',
    },
    FCM: {
        API_KEY: 'FCM_API_KEY'
    },
    UI_PATHS: {
        BASE_PATH: process.env.CLIENT_APP_BASE_URL || 'http://localhost:4200',
        RESET_PASSWORD_PATH: process.env.CLIENT_APP_RESET_PASSWORD_PATH || '/reset-password/',
    },
    ENV_STAGING: "staging",
    ENV_DEVELOPMENT: "development",
    ENV_PRODUCTION: "production",
    environment: process.env.NODE_ENV || 'development',
    mongoDB: {
        PROTOCOL: process.env.DB_PROTOCOL || 'mongodb',
        HOST: process.env.DB_HOST || '127.0.0.1',
        PORT: process.env.DB_PORT || 27017,
        NAME: process.env.DB_NAME || PLATFORM,
        USER: '',
        PASSWORD: '',
        get URL() { return process.env.dbUrl || `${this.PROTOCOL}://${this.HOST}:${this.PORT}/${this.NAME}` }
    },
    domain: {
        PROTOCOL: process.env.DOMAIN_PROTOCOL || 'http',
        HOST: process.env.DOMAIN_HOST || '127.0.0.1',
        PORT: process.env.DOMAIN_PORT ? process.env.DOMAIN_PORT : '5000',
        get URL() { return `${this.PROTOCOL}://${this.HOST}${!!this.PORT ? ':' + this.PORT : ''}` }
    },
    server: {
        PROTOCOL: process.env.SERVER_PROTOCOL || 'http',
        HOST: process.env.SERVER_HOST || '0.0.0.0',
        PORT: process.env.SERVER_PORT || '3002',
        get URL() { return `${this.PROTOCOL}://${this.HOST}:${this.PORT}` }
    },
    PATH_FOR_LOCAL: process.env.PATH_FOR_LOCAL || '/uploads/',
    SERVER_URL: process.env.SERVER_URL || 'http://localhost:5000',
    swagger: require('./swagger'),
    s3Bucket: {
        accessKeyId: process.env.ACCESS_KEY_ID || 'access-key-id',
        secretAccessKey: process.env.SECRET_ACCESS_KEY || 'secret-access-key',
        bucketName: process.env.S3_BUCKET_NAME || 'bucket-name'
    },
    REDIS: {
        PORT: process.env.REDIS_PORT || '6379',
        HOST: process.env.REDIS_HOST || '127.0.0.1'
    },
    SERVER_URL: process.env.SERVER_URL || 'http://localhost:5000',
    PATH_TO_UPLOAD_FILES_ON_LOCAL: process.env.PATH_TO_UPLOAD_FILES_ON_LOCAL || '/uploads/files',
};



