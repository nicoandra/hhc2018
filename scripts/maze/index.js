const $ = require('jQuery');
const request = require('request');
const jsdom = require("jsdom");



request.get('https://vents.kringlecastle.com/', function(err, res) {

    const {JSDOM} = jsdom;
    const sourceCode = res.body;
    const dom = new JSDOM(sourceCode);
    const $ = (require('jquery'))(dom.window);

    const script = $('script');
    console.log(script['0'], script['1'], script['2']);



})

