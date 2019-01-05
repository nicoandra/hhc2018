const express = require('express');
const app = express();
const http2 = require('http2');
const fs = require('fs');

let client = http2.connect('https://packalyzer.kringlecastle.com', {});
client.on('error', (err) => console.error(err));
client.on('close', () => {
	client = http2.connect('https://packalyzer.kringlecastle.com', {});
})

app.get('*', function(req, res, next) {

	// console.log(Object.keys(req), req.url);



	const h2req = client.request({ ':path': '/dev' + req.url });

	let headers = { 'ProxyedBy' : 'Nic Ghetto Proxy v0.1'}, response;
	h2req.on('response', (h2headers, flags) => {

		if (undefined !== h2headers[':status'] && h2headers[':status'] == 404) {
			return ;
		}

		if (h2headers['content-length'] < 50) {
			 return;
		}



	  for (const name in h2headers) {
			headers[name] = h2headers[name];
	  }
	});

	h2req.setEncoding('utf8');
	let data = '';
	h2req.on('data', (chunk) => { data += chunk; });


	h2req.on('end', () => {


		if(!data.includes("Error: ENOENT")){
			console.log("200", req.url);
		}

		return res.send(data);
	  // console.log(`\n${data}`);
	  // client.close();
	});
	h2req.end();
	//


	// return res.send({'body': req.body, 'status': 'ok'});

})

app.listen(8800);
/*


*/
