const emailSettings = async (cutomer_email, email_value) => {

    console.log(`Need email_settings values`)
    const nodemailer = require("nodemailer");

    async function main() {

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: "",
            // port: 465,
            // secure: true, // true for 465, false for other ports
            auth: {
                user: '',
                pass: ''
            },
	        tls: { //<= it was available for last working time
	            // do not fail on invalid certs
	            rejectUnauthorized: false
	        }
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '', // sender address
            to: cutomer_email, // list of receivers
            subject: email_value.subject, // Subject line
            // text: "Hello world?", // plain text body
            html: email_value.text, // html body
        });
    }

    main().catch(console.error);

}

module.exports = emailSettings;