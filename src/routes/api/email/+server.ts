import { env } from '$env/dynamic/private';
import { createTransport } from 'nodemailer';
import type { RequestHandler } from './$types';

const myEmail = 'hambasahaya0303@gmail.com'

const transporter = createTransport({
    service: 'gmail',
    auth: {
        user: myEmail,
        pass: env.EMAIL_APP_PASSWORD
    }
})

const sendPasswordRecoveryEmail = (userEmail: string,) => {
    const mailOptions = {
        from: myEmail,
        to: userEmail,
        subject: 'Mamah',
        text: `Harta Hahta Mamah Yuuka`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};

export const GET: RequestHandler = async () => {
    try {
        sendPasswordRecoveryEmail("silentsniper0303@gmail.com")

        return new Response(JSON.stringify({
            text: "hello"
        }))
    } catch (error) {
        return new Response(JSON.stringify({
            status: 500,
            text: "Error"
        }))
    }

};