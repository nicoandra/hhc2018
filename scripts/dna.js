

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





function humanize(encoded){
    const chars = encoded.split("");

    const sections = chars.reduce((accumulator, thisChar, index) => {

        const sectionNumber = Math.floor(index / 2);

        if (!accumulator[sectionNumber]) {
            accumulator[sectionNumber] = '';
        }

        if (accumulator[sectionNumber].length < 2) {
            accumulator[sectionNumber] += thisChar;
        }

        return accumulator

    }, []);

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

    const decimalParts = sections.map((chars) => {
        return getBase4Digit(chars);
    })
    console.log(decimalParts.slice(36, 40));



    const avatar = {
        size: parseInt(decimalParts.slice(0, 4).join("",""), 4).toString(10),
        legs: parseInt(decimalParts.slice(4, 12).join("",""), 4).toString(10),
        hue : parseInt(decimalParts.slice(12, 20).join("",""), 4).toString(10),
        torso : parseInt(decimalParts.slice(20, 28).join("",""), 4).toString(10),
        head : parseInt(decimalParts.slice(28, 36).join("",""), 4).toString(10),
        saturation : parseInt(decimalParts.slice(36, 40).join("",""), 4).toString(10),
        mouth : parseInt(decimalParts.slice(40, 48).join("",""), 4).toString(10),
        eyes : parseInt(decimalParts.slice(48, 56).join("",""), 4).toString(10),
        brightness : parseInt(decimalParts.slice(56, 60).join("",""), 4).toString(10),
    }
    return avatar;


}


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

    sections[1] = encodeDecToLetter(0);     // Maybe here

    sections[2] = encodeDecToLetter(0);     // Maybe here
    sections[3] = encodeDecToLetter(0);     // Size? = 3

    sections[8] = encodeDecToLetter(0);    // Legs = 9 , 10, 11 to try
    sections[9] = encodeDecToLetter(0);
    sections[10] = encodeDecToLetter(2);
    sections[11] = encodeDecToLetter(0);    // 0-8

    sections[16] = encodeDecToLetter(3);    // Hue
    sections[17] = encodeDecToLetter(3);    //
    sections[18] = encodeDecToLetter(3);    //
    sections[19] = encodeDecToLetter(3);    //


    sections[24] = encodeDecToLetter(0);  // Torso = 7
    sections[25] = encodeDecToLetter(0);    // 0-8
    sections[26] = encodeDecToLetter(2);  // Torso = 7
    sections[27] = encodeDecToLetter(0);    // 0-8


    sections[34] = encodeDecToLetter(1);    // Head 0-11
    sections[35] = encodeDecToLetter(0);    // = 4


    sections[46] = encodeDecToLetter(1);    // Mouth 0-11
    sections[47] = encodeDecToLetter(0);    // 4

    sections[54] = encodeDecToLetter(1);    // Eyes 0-11
    sections[55] = encodeDecToLetter(0);    // 4

    sections[58] = encodeDecToLetter(0);    // Brightness
    sections[59] = encodeDecToLetter(0);    // 4

    // console.log(sections);
    return sections.join("","");
}


function buildMissingNoDna(legs, torso) {
  const dna = Array(60).fill(encodeDecToLetter(0));

  dna[0] = encodeDecToLetter(3);  // Size equal to leg number
  dna[1] = encodeDecToLetter(3);
  dna[2] = encodeDecToLetter(3);
  dna[3] = encodeDecToLetter(3);

  dna[8] = encodeDecToLetter(3);
  dna[9] = encodeDecToLetter(3);
  dna[10] = encodeDecToLetter(3); // legs 0-8 = 9
  dna[11] = encodeDecToLetter(3);

  dna[16] = encodeDecToLetter(3);    // Hue
  dna[17] = encodeDecToLetter(3);    //
  dna[18] = encodeDecToLetter(3);    //
  dna[19] = encodeDecToLetter(3);    //

  dna[24] = encodeDecToLetter(3);  // Torso = 7
  dna[25] = encodeDecToLetter(3);    // 0-8
  dna[26] = encodeDecToLetter(3);  // Torso = 7
  dna[27] = encodeDecToLetter(3);    // 0-8

  dna[32] = encodeDecToLetter(3);    // Head 0-11
  dna[33] = encodeDecToLetter(3);    // Head 0-11
  dna[34] = encodeDecToLetter(3);    // Head 0-11
  dna[35] = encodeDecToLetter(3);    // = 4


  dna[32] = encodeDecToLetter(3);    // Head 0-11
  dna[33] = encodeDecToLetter(3);    // Head 0-11
  dna[34] = encodeDecToLetter(3);    // Head 0-11
  dna[35] = encodeDecToLetter(3);    // = 4


  dna[38] = encodeDecToLetter(3);    // Saturation
  dna[39] = encodeDecToLetter(3);    // = 4

  dna[44] = encodeDecToLetter(3);    // Mouth 0-11
  dna[45] = encodeDecToLetter(3);    // 12
  dna[46] = encodeDecToLetter(3);    // Mouth 0-11
  dna[47] = encodeDecToLetter(3);    // 12

  dna[52] = encodeDecToLetter(3);    // Eyes 0-11
  dna[53] = encodeDecToLetter(3);    // Eyes 0-11
  dna[54] = encodeDecToLetter(3);    // Eyes 0-11
  dna[55] = encodeDecToLetter(3);    // 12


  dna[58] = encodeDecToLetter(3);    // Brightness
  dna[59] = encodeDecToLetter(3);    // 4
  dna[60] = encodeDecToLetter(3);    // Brightness
  dna[61] = encodeDecToLetter(3);
  dna[62] = encodeDecToLetter(3);
  dna[63] = encodeDecToLetter(3);


  return dna.join("","");
}



function overflow() {
  const dna = Array(64).fill(encodeDecToLetter(3));
  dna[0] = encodeDecToLetter(0);
  dna[1] = encodeDecToLetter(1);
  dna[2] = encodeDecToLetter(0);
  dna[3] = encodeDecToLetter(0);  //

/*  dna[0] = encodeDecToLetter(3);  // Valid DNA
  dna[1] = encodeDecToLetter(3);  // Valid DNA
  dna[2] = encodeDecToLetter(3);  // Valid DNA
  dna[3] = encodeDecToLetter(3);  // Valid DNA


  dna[4] = encodeDecToLetter(3);
  dna[5] = encodeDecToLetter(3);
  dna[6] = encodeDecToLetter(3); // legs 0-8 = 9
  dna[7] = encodeDecToLetter(3);
  dna[8] = encodeDecToLetter(3);
  dna[9] = encodeDecToLetter(3);
  dna[10] = encodeDecToLetter(3); // legs 0-8 = 9
  dna[11] = encodeDecToLetter(3);

  dna[15] = encodeDecToLetter(1);

  dna[23] = encodeDecToLetter(1);    //

  dna[31] = encodeDecToLetter(1);    // 0-8

  dna[37] = encodeDecToLetter(3);    // Saturation

  dna[43] = encodeDecToLetter(3);    // Mouth 0-11

  dna[51] = encodeDecToLetter(3);    // Eyes 0-11

  dna[57] = encodeDecToLetter(3);    // Brightness*/


  return dna.join("","");
}





function vuln() {
    const dna = Array(64).fill(encodeDecToLetter(0));


    dna[3] = encodeDecToLetter(1);    // Size needs to be 0 or 1


    // Legs is size=8 , so the value needs to be at most 2^(8+1) = 512 = 20000
    dna[7] = encodeDecToLetter(2);
    /*dna[8] = encodeDecToLetter(0);
    dna[9] = encodeDecToLetter(0);
    dna[10] = encodeDecToLetter(0); // legs 0-8 = 9
    dna[11] = encodeDecToLetter(0); */

    // Hue is size=8, so the value needs to be at most 2^(8+1) =
    dna[15] = encodeDecToLetter(2);
    /*dna[18] = encodeDecToLetter(3);    //
    dna[19] = encodeDecToLetter(1);    */


    // Torso is size=8, so the value needs to be at most 2^(8+1) = 512 = 20000
    dna[23] = encodeDecToLetter(2);  // Torso = 7
    // dna[27] = encodeDecToLetter(0);    // 0-8


    // Torso is size=8, so the value needs to be at most 2^(8+1) =
    dna[31] = encodeDecToLetter(2);    // Head 0-11
    // dna[35] = encodeDecToLetter(1);    // = 4


    // Saturation is size=4, so the value needs to be at most 2^(4+1) =
    dna[37] = encodeDecToLetter(2);    // Saturation
    /* dna[38] = encodeDecToLetter(3);    // Saturation
    dna[39] = encodeDecToLetter(3);    // = 4 */

    // Mouth is size=8, so the value needs to be at most 2^(8+1) = 512 = 20000
    dna[43] = encodeDecToLetter(2);    // Mouth 0-11
    //dna[47] = encodeDecToLetter(1);    // 12


    // Eyes is size=8, so the value needs to be at most 2^(8+1) = 512 = 20000
    dna[51] = encodeDecToLetter(2);    // Eyes 0-11
    // dna[55] = encodeDecToLetter(1);    // 12

    // Brightness is size=4, so the value needs to be at most 2^(4+1) = 200

    dna[57] = encodeDecToLetter(2);    // Brightness
    // dna[59] = encodeDecToLetter(0);    // 4

    return dna.join("","");
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



console.log(vuln());
console.log(humanize(vuln()));


// All zero + legs 9 = MISSINGNO.

// 001 + Legs 9 + 0 0 0 1 = MISSINGNO
// 01 + Legs 9 + 0 0 0 1

// {"type":"DENNIS_NEDRY","scope":"app","target":"app","messages":["Your information has been updated!"]}

// console.log(buildDnas(encoded));
// console.log(decode(buildDnas(encoded)));
// console.log(decode(encoded));
