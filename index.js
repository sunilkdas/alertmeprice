const puppeteer = require('puppeteer');
const domain = "https://www.amazon.in";
const nodemailer = require('nodemailer');
setInterval(function() {
    (async() => {
        try {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto(domain, {
                timeout: 3000000
            });
            await page.type('#twotabsearchtextbox', 'Nikon D3500 W/AF-P DX Nikkor 18-55mm f/3.5-5.6G');
            await page.click('input.nav-input');
            await page.waitForSelector('.s-image');
            const products = await page.evaluate(() => {
                const links = Array.from(document.querySelectorAll('.s-result-item'));
                return links.map(link => {
                    if (link.querySelector(".a-price-whole")) {
                        return {
                            name: link.querySelector(".a-size-medium.a-color-base.a-text-normal").textContent,
                            url: link.querySelector(".a-link-normal.a-text-normal").href,
                            image: link.querySelector(".s-image").src,
                            price: parseInt(link.querySelector(".a-price-whole").textContent.replace(/[,]/g, '')),
                        };
                    }
                }).slice(0, 1);
            });

            if (products[0].price < 26000) {
                console.log(products[0])
            } else {
                console.log(products[0])
            }
            var information = JSON.stringify(products[0]);
            async function main() {
                // Generate test SMTP service account from ethereal.email
                // Only needed if you don't have a real mail account for testing
                //let testAccount = await nodemailer.createTestAccount();

                // create reusable transporter object using the default SMTP transport
                let transporter = nodemailer.createTransport({
                    host: 'smtp.gmail.email',
                    port: 587,
                    service: 'gmail',
                    secure: false, // true for 465, false for other ports
                    auth: {
                        user: "#youremail", // generated ethereal user
                        pass: "#yourpassword" // generated ethereal password
                    }
                });

                // send mail with defined transport object
                let info = await transporter.sendMail({
                    from: 'automata', // sender address
                    to: '#toemail',
                    // list of receivers
                    subject: 'Nikon D3500 Price', // Subject line
                    text: 'Nikon D3500 Price', // plain text body
                    html: '<b>' + information + '</b>' // html body
                });

                console.log('Message sent: %s', info.messageId);
                // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

                // Preview only available when sending through an Ethereal account
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
            }

            main().catch(console.error);

            // close the browser
            await browser.close();

        } catch (error) {
            // display errors
            console.log(error)
        }
    })();
}, 3000);