const nodemailer = require('nodemailer')
// Todo 0: if using mode mial in route, please create try catch or asnc await with
// the title of: 
//              function nodeMail(req, res, next){ }
function nodeMail (requestUser)
{
    const output = `
        <p>You have a new contact request</p>
        <h3>Contact Details</h3>
        <ul>  
        <li>Name: ${ requestUser.name }</li>
        <li>Email: ${ requestUser.email }</li>
        </ul>
    `;

    const mailSender = ""  // Todo 1: generated ethereal user
    const password = "" //Todo 2: generated ethereal password

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport( {
        service: "gmail",
        auth: {
            user: mailSender,
            pass: password  
        },

    } );

    // setup email data with unicode symbols
    let mailOptions = {
        from: mailSender, // sender address
        to: requestUser.email, // list of receivers
        subject: 'Node Contact Request', // Subject line
        text: 'Hello world?', // plain text body
        html: output // html body
    };

    // send mail with defined transport object
    transporter.sendMail( mailOptions, ( error, info ) =>
    {
        if ( error ) {
            return console.log( error );
        }
        console.log( 'Message sent: %s', info.messageId );
        console.log( 'Preview URL: %s', nodemailer.getTestMessageUrl( info ) );

        // Todo 3: if using in the route, please use try catch or asnc await
        //      res.render( 'contact', { msg: 'Email has been sent' } );
        console.log("Email has been sent")
    } );
}

module.exports = nodeMail;