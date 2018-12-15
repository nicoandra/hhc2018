

const encoded = "ATATATTAATATATATATATATATATATATATATGCGCATATATATATATATATATATATATATATATATATATATTATAATATATATATATATATATATATATATATATATATATTATA";

console.log("A valid DNA should have " + encoded.length + " chars");

function decode(encoded) {
    const chars = encoded.split("");

    const sections = chars.reduce((accumulator, thisChar, index) => {

        const sectionNumber = Math.floor(index / 4);

        if (!accumulator[sectionNumber]) {
            accumulator[sectionNumber] = '';
        }

        if (accumulator[sectionNumber].length < 4) {
            accumulator[sectionNumber] += thisChar;
        }

        return accumulator

    }, []);

    // console.log(sections);

    function getBase4Digit(chars) {
        switch (chars) {
            case 'AT':
                return 0;
            case 'TA':
                return 1;
            case 'GC':
                return 2;
            case 'CG':
                return 3;
        }

    }

    let decimals = {}
    sections.forEach((section, index) => {
        const parts = section.match(/.{1,2}/g);

        const digits = getBase4Digit(parts[0]) * 4 + getBase4Digit(parts[1]);

        let name = 'Block' + index;
        switch(index){
            case 0:
                name = "Probably separator" + name; break;
            case 1:
                name = "Probably Size " + name; break;

            case 2:
            case 3:
                name = "Separator + something else " + name; break;

            case 4:
            case 5:
                name = "Legs " + name;
                break;

            case 6:
            case 7:
            case 14:
            case 15:
            case 18:
            case 20:
            case 21:
            case 24:
            case 25:
                name = "(Separator??) " + index; break;

            case 8:
            case 9:
                name = "Hue (to be confirmed) " + name;
                break;


            case 12:
            case 13:
                name = "Torso (confirmed) " + name;
                break;

            case 16:
            case 17:
                name = "Head (confirmed) " + name;
                break;

            case 19:
                name = "Saturation (to be confirmed) " + name;
                break;

            case 22:
            case 23:
                name = "Mouth (to be confirmed) " + name;
                break;

            case 26:
            case 27:
                name = "Eyes (to be confirmed) " + name;
                break;


            case 29:
                name = "Brightness (to be confirmed) " + name;
                break;
        }
        decimals[name] = digits;

    })

    return decimals;
}

function generateAllZero(){
    return Array(60).fill('AT').join("","");
}


//  console.log(decode(encoded), generateAllZero());






function encodeDecToLetter(param) {
    switch(param) {
        case 0 :
            return 'AT';
        case 1 :
            return 'TA';
        case 2 :
            return 'GC';
        case 3 :
            return 'CG';
    }
}
// const encoded = "ATATATATATATATATATATATATATATATATTACGCGGCATATATATATATATATATATATATATATATATATATGCATATATATATATATATATATATATATATATGCCGATATTAAT";

console.log("A valid DNA should have " + encoded.length + " chars");

function buildDnas(encoded) {
    const chars = encoded.split("");
    const length = 2;
    const sections = chars.reduce((accumulator, thisChar, index) => {

        const sectionNumber = Math.floor(index / length);

        if (!accumulator[sectionNumber]) {
            accumulator[sectionNumber] = '';
        }

        if (accumulator[sectionNumber].length < length) {
            accumulator[sectionNumber] += thisChar;
        }

        return accumulator

    }, []);

    sections[2] = encodeDecToLetter(0);     // Maybe here
    sections[3] = encodeDecToLetter(3);     // Size = 3

    sections[10] = encodeDecToLetter(2);    // Legs = 9
    sections[11] = encodeDecToLetter(1);    // 0-8

    sections[16] = encodeDecToLetter(0);    // Hue
    sections[17] = encodeDecToLetter(0);    //
    sections[18] = encodeDecToLetter(0);    //
    sections[19] = encodeDecToLetter(1);    //

    sections[26] = encodeDecToLetter(1);  // Torso = 7
    sections[27] = encodeDecToLetter(3);    // 0-8


    sections[34] = encodeDecToLetter(1);    // Head 0-11
    sections[35] = encodeDecToLetter(0);    // = 4


    sections[46] = encodeDecToLetter(1);    // Mouth 0-11
    sections[47] = encodeDecToLetter(0);    // 4

    sections[54] = encodeDecToLetter(1);    // Eyes 0-11
    sections[55] = encodeDecToLetter(0);    // 4

    // console.log(sections);
    return sections.join("","");

}

function validateSequence(e) {
    if (!e){
        return g; // g = 1
    }

    if ("" == `${e}`){ // g = 1
        return g;
    }

    if (!/((?:AT|TA|GC|CG){60})/i.test(e)){
      return g; // g = 1
    }

    const t = b.getSize();

    if (e.length / 8 !== t){
        return g; // g = 1
    }

    const n = b.decodeDNASequence(e);


    return !!Object(i.filter)(n, (e,t)=>{
        if ("size" === t)
            return 0 > e || e >= d.length;

        if (Object(i.includes)(Object.keys(A), t))
            return 0 > e || e >= A[t].count;

        const n = Object(i.find)(c, {
            name: t
        });

        return !!n && (0 > e || e > parseInt(Array(n.size + 1).join("1"), 2).toString(10))
    }).length && x
}



console.log("1 && 2", 1 && 2)
console.log("2 && 2", 2 && 2)
console.log("3 && 2", 1 && 2)

console.log("SEND", '{"type":"WS_UPDATE_USER","avatar":"'+buildDnas(encoded)+'"}');
console.log("RECEIVE", '{"type":"WS_USERS","users":{"7652":{"gdprDocId":"1171","email":"nico@nmac.com.ar","username":"netspanker","avatar":"'+buildDnas(encoded)+'","country":"AR"}},"initialLogin":true}')


console.log(buildDnas(encoded));
// console.log(decode(buildDnas(encoded)));
// console.log(decode(encoded));
