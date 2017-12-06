const mqtt = require('mqtt');
let dbCtrl = require('./db');
const request = require('request');

module.exports = function(){
    let th = {};
    th.t = th.h = 0;
    var client = mqtt.connect('mqtt://ajoan.com:1883');
    client.on('connect', function () {
        console.dir('mqtt connected');
        client.subscribe('/t');
        client.subscribe('/h');
        client.publish('/qos1', 'Hello mqtt');
    });

    client.on('message', function (topic, message) {        
        console.log(`msg: ${message}, topic: ${topic}`);
        // message is Buffer
        switch (topic) {
            case '/t':
                th.t = message;
                console.log('t: ', message.toString());
                break;

            case '/h':
                th.h = message;
                console.log('h: ', message.toString());
                break;
        }
        if (th.t !== 0 && th.h !== 0){
            console.log('start writing...');
            //dbCtrl.writeDhtData(th);
            request.post({
                url: 'http://localhost:3000/dht11',
                headers: {
                    "Content-Type": "application/json"
                },
                body: {
                    't': th.t.toString(),
                    "h": th.h.toString()
                },
                json: true
            }, (err, res, body) => {
                console.error(err);
                th.t = th.h = 0;
            });
            
        }
        //client.end()
    });
}

