let net = require('net');
let os = require('os');
let disk = require('check-disk-space');
let name = 'Main Droplet';
let ip = '10.10.20.187';
let port = 1996;


function start() {

    let client = net.createConnection({host: '159.203.124.198', port: 1234}, function () {


        client.on('connect', () => {
            console.log('hello')

        });


        client.on('end', function () {
            console.log('Closing connection with the client');


        });
        client.on('error', function (err) {
            console.log(`Error: ${err}`);
        });
        client.on('data', function (data) {
            try {
                let msg = JSON.parse(data);

                switch (msg.type) {
                    case 'connect':
                        console.log('made it')
                        disk('/root').then((diskSpace) => {//creates process object
                            let processObject = {
                                name: name,
                                uptime: os.uptime(),
                                disk: (diskSpace.size - diskSpace.free) / 25 * 100,
                                memory: os.totalmem(),
                                loader: os.loadavg(),
                                networkIn: os.networkInterfaces()
                            };
                            let ipObject = {
                                ip: ip,
                                port: port
                            };
                            client.write(JSON.stringify({type: 'cack', data: processObject, ip: ipObject}));
                            // console.log('process  object:  ' + JSON.stringify(processObject));

                        });

                        break;

                    case 'resend':
                        disk('/root').then((diskSpace) => {//recreates process object
                            let processObject = {
                                name: name,
                                uptime: os.uptime(),
                                disk: (diskSpace.size - diskSpace.free) / 25 * 100,
                                memory: os.totalmem(),
                                loader: os.loadavg(),
                                networkIn: os.networkInterfaces()
                            };
                            client.write(JSON.stringify({type: 'updateServer', data: processObject}));


                        });

                        break;


                    default:
                        break;
                }
                ;
            } catch (ex) {
                console.log(ex.message);
            }
            ;


        });


    });
};
start();







