// the package that will screenshot and convert the html page into a pdf
const puppeteer = require('puppeteer'); 
//the package that will manage the delivery of the file by email
const nodemailer = require('nodemailer');
// the package that will request a url from the user
const prompt = require('prompt-sync')();

async function printPDF(url) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, {waitUntil: 'networkidle0'});
    const pdf = await page.pdf({ format: 'A4' });
   
    await browser.close();
    return pdf
  }
class Email {
    static sendEmail(to, subject, text, filename, fileContent) {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'email', // write your email address to be sent from
                pass: 'password' // your email's password
            }
        });

        const mailOptions = {
            from: 'email', // Update from email
            to: to,
            subject: subject,
            text: text,
            attachments: [{
                filename: filename,
                content: fileContent
            }]
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }

            console.log('Message sent: %s', info.messageId);
        });
    }
}

(async() => {
    const url = prompt('Write the link for the desired article to be sent:');
    const pdf = await printPDF(url);
    Email.sendEmail(
        'Kindle email', // the kindle's email
        'convert', // the subject, the written subject is convert so the pdf will be converted
        'I thought you might enjoy this book!', // text
        'pdf name', //choose a name for the pdf file
        pdf);
})();