const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const { get } = require('request');
const https = require('https');
const { response } = require('express');
const { STATUS_CODES } = require('http');

const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/signup.html');
});

app.post('/', (req, res) => {
    let firstName = req.body.fName;
    let lastName = req.body.lName;
    let email = req.body.email;

    let data = {
        members: [
            {
                email_address: email,
                status: 'subscribed',
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    app.post('/failure', (req, res) => {
        res.redirect('/');
    });

    const jsonData = JSON.stringify(data);

    const url = 'https://us21.api.mailchimp.com/3.0/lists/38b4b1332343';

    const options = {
        method: 'POST',
        auth: 'nazar:7b610d98f76e40a20d6ccbcd1982db6d-us21'
    };

    const request = https.request(url, options, (response) => {
        if (response.statusCode === 200) {
            res.sendFile(__dirname + '/success.html');
        } else {
            res.sendFile(__dirname + '/failure.html');
        }

        response.on('data', (data) => {
            console.log(data);
        });
    });

    request.write(jsonData);
    request.end();
});

app.listen(process.env.PORT || 3000, () => {
    console.log('running on 3000');
});

// API key
// 7b610d98f76e40a20d6ccbcd1982db6d-us21

// mail chimp
//38b4b13323