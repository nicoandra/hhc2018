const $ = require('jQuery');
const request = require('request');
const jsdom = require("jsdom");



request.get('https://vents.kringlecastle.com/', function(err, res) {

    const {JSDOM} = jsdom;
    const sourceCode = res.body;
    const dom = new JSDOM(sourceCode);
    const $ = (require('jquery'))(dom.window);

    const jsLines = $('script')[2].text.split("\n");
    // console.log(jsLines);

    const interestingValues = ['mazef', 'mazex','mazey','locationkey'];

    const mapPosition = {}
    interestingValues.forEach((interestingValue) => {
        jsLines.forEach((jsLine) => {

            const worth = jsLine.includes('"' + interestingValue + '"');
            if(!worth){
                return ;
            }
            console.log("Line ", jsLine, "contains the interesting value", interestingValue);
            const foundValue = jsLine.match(/(.*).value = "(.*)"/)[2];
            mapPosition[interestingValue] = foundValue;

        })
    })

    console.log(mapPosition);


})

