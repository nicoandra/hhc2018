# hhc2018

Notes on the holiday hack challenge.

# SPOILERS AHEAD
If you don't want the spoilers, please STOP READING now.

# Contact and contribution
- Clone, make a PR, good to go.
- Contact me at @imsonico over Twitter ;

# Dependencies:
- Nodejs: for CLI scripts to build DNAs

# DOM and sockets
This custom version of main.js contains a few upgrades.
- You can `console.log(functions)` and see the list of functions; so you can navegate it to find what they do.
- The WebSocket is exposed to the global scope. You can add event listeners, send messages, anything you can do with a socket.

# Basic setup you need
- Burp or ZAP Proxy; I use Burp. Any proxy which lets you manipulate WebSockets will do.
- Chromium browser configured to use your proxy as listed in the previous point.
- The Proxy SSL certificate installed in Chromium.
- Investigate how to use Sources Overrides in Chrome/Chromium
- Use `assets/kringlecon.com/main.js%3f9c4bcb0809532cd03df9` to override `main.js`


- Why Chromium? Because the Javascript debugger actually works and you'll need to debug Javascript code. Use the debugger!

# DNA
Things I've figured out:
- There's a DNA
- It can be manipulated by playing with WebSockets
- You can send a forged DNA, but still need to update the response from the server for the missingno. image to appear.

The Main.js file contains this snippet:

![Data lengths](docs/main001.png?raw=true "Data lengths")

From there you can infer the amount of characters used to encode the DNA. Note the interface limits the "torso" and "legs" options to 9 values: 0 to 8.
However the size specified in the JS says 8 letters. But each number is encoded in base 4:

![Number mapping](docs/main002.png?raw=true "Data mapping")

The interface lets you pick a number between 0 and 8:
```
- 0: AT AT
- 1: AT TA
- 2: AT GC
- 3: AT CG
- 4: TA AT
- 5: TA TA
- 6: TA GC
- 7: TA CG
- 8: GC AT
```

All these are using 4 characters, but we've seen above we can use up to 8; which means that `TA AT AT AT` (thus 64) would still be a valid "torso".



The DNA needs to contain the mapped numbers only. So AT, TA, CG, GC. There's a DNA listed [here](https://www.ncbi.nlm.nih.gov/Class/MLACourse/Modules/BLAST/q_jurassicparkDNA.html) which won't work because it contains non-accepted symbols, like TT.

The decoding function reads as follows:
```javascript
decodeDNASequence: e => b.unpack((e.match(/..?/g) || []).map(e => h[e]).join(""), 4),
```

Deobfuscated would be (not tested):

```javascript
decodeDNASequence: (e) => {

  const parts = (e.match(/..?/g) || []); // Maps becomes an array like [ ['AT'], ['AT'], ['TA'] ... ], 60 pairs of characters.
  const numbers = parts.map((pair) => { return h[pair]; }); // H is the list of mappings, see above. Now numbers became a list like [[0], [0], [1], ... ]
  const stringOfNumbers = numbers.join(""); // Glue them all together
  return b.unpack(stringOfNumbers, 4);  //
}
```

See [legs](assets/images/avatars/legs_full_boards.png?raw=true) and [torso](assets/images/avatars/torso_full_boards.png?raw=true) images. Both images include 3 additional transparent sections. It seems the options:

legs: 9, 10 11
torso: 9, 10, 11

Appear in the image, but are not available in the interface. The allowed values in the interface are 0 to 8.




* Interesting files
- There's a badge.png in images: https://kringlecon.com/images/badge.png


# DNA Validation

Here are a few deobfuscated functions. Original snippets:

```javascript
validateSequence(e) {
    if (!e)
        return g;
    if ("" == `${e}`)
        return g;
    if (!/((?:AT|TA|GC|CG){60})/i.test(e))
        return g;
    const t = b.getSize();
    if (e.length / 8 !== t)
        return g;
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
    }
    ).length && x
},

// [...]
 decodeDNASequence: e=>b.unpack( (e.match(/..?/g) || []) .map(e=>h[e]).join(""), 4)

// [...]
 unpack : (e, t = 16) {
     if ("string" != typeof e) return {
         error: "invalid format"
     };
     if (e.length < b.getSize()) return {
         error: "invalid input length"
     };
     let n = 0;
     return c.reduce((a, {
         name: o,
         size: i = 8
     }) => {
         const s = parseInt(e.slice(n, n + r(16 * i / 4 / t)), t);
         return n += r(16 * i / 4 / t), Object.assign({}, a, {
             [o]: s
         })
     }, {})
 },

```

And here they are deobfuscated:

```javascript
    validateSequence : (e) => {

        console.log("validateSequence : ", { g , x, e })

        if (!e){ return g; }
        if ("" == `${e}`){ return g; }
        if (!/((?:AT|TA|GC|CG){60})/i.test(e)){ return g; }

        const t = 15;  // b.getSize();  // t will always be 15, getSize is the SUM of all fields

        if (e.length / 8 !== 15){ return g; }   // The DNA must be 120 characters, not more not less

        const n = b.decodeDNASequence(e);

        const callback = (e,t)=>{
            // t is the field name (size, legs, eyes, etc)
            // e is the actual decimal value (0,1,2,...512?)

            if ("size" === t){
                if(0 > e){ return true; } // Size can not be less than 0
                if(e >= d.length){ return true; } // Size must be less than 2; d.length = 2
                return false;
            }

            // if (Object(i.includes)(Object.keys(A), t)) // the if condition is reworked below
            const validProperties = Object.keys(A);

            if (validProperties.includes(t)){
                if(0 > e){ return true; }           // e needs to be 0 or greater

                /* Counts are (kinda, look in main.js for exact code):
                    A = {
                        legs: { count: 9 },
                        torso: { count: 9 },
                        head: { count: 12 },
                        mouth: { count: 12 },
                        eyes: { count: 12 }
                    }
                 */

                if(e >= A[t].count){ return true; } // e needs to be less than the count of options for that item (eyes, mouth, etc)
                return false;
            }


            const n = Object(i.find)(c, {
                name: t
            });

            const condA = 0 > e;  // e needs to be positive

            let compar = Array(n.size + 1).join("1"); //
            compar = parseInt(compar, 2).toString(10);
            // For n.size = 4   => compar =     11111 => 31 => what if we send 32 ?
            // For n.size = 8   => compar = 111111111 => 511 => what if we send 512 ?
            // Response: it is validated

            const condB = e > compar;

            return !!n && (condA || condB);
        }

        const howManyValidFields = Object(i.filter)(n, callback).length;

        const toReturn = !!howManyValidFields && x
        return toReturn;

    },

     decodeDNASequence: (e) => {

        /* h is the mapping from letters to numbers :

        h = {   AT: "0",
                TA: "1",
                GC: "2",
                CG: "3" }         
        */

        const pairsOfLetters = e.match(/..?/g); // Now pairsOfLetters = [[AT], [AT], [TA], ... ]
        const dnaAsArray = pairsOfLetters || [];

        const callback = (e) => {
            if (e == 'AT') return 0;
            if (e == 'TA') return 1;
            if (e == 'GC') return 2;
            if (e == 'CG') return 3;
        }

        let toUnpack = dnaAsArray.map(callback);   // toUnpack is now [ 0, 0, 0 , 1, ... ]
        toUnpack = toUnpack.join(""); // toUnpack is a list of numbers
        return b.unpack(toUnpack , 4)
     }

    unpack(e, t = 16) {
        /* t = 4 as it's passed in the call above. It will always be 4 */

        if ("string" != typeof e) return {
            error: "invalid format"
        };

        const minSize = b.getSize(); // It is 15
        if (e.length < minSize) return {     
            error: "invalid input length"
        };

        let n = 0;

        let initialObject = {};

        return c.reduce(

            (a, { name: o, size: i = 8 }) => {

                /*
                o is one of eyes, mouth, head, etc... (name from below)
                i is the size from below

                var c = [
                { name: "size", size: 4 },
                { name: "legs", size: 8 },
                { name: "hue", size: 8 },
                { name: "torso", size: 8 },
                { name: "head", size: 8},
                { name: "saturation",size: 4 },
                { name: "mouth", size: 8 },
                { name: "eyes", size: 8 },
                { name: "brightness", size: 4 }];

                */

                const sectionLength =  r(16 * i / 4 / t); // this will be equal to i, so size as listed above.
                //  But still did not check for occurrences of unpack() with a different 2nd parameter (!= 4)

                const section = e.slice(n, n + sectionLength);  // Get i characters, starting from n

                const s = parseInt(section, t); // Convert the strings from base-4 to base-10

                // n += r(16 * i / 4 / t); // Reworked below to be readable.
                n = n + sectionLength;  // Move n to be i positions higher, to read the next number in the chain

                // Add the property to the a object, and return the object to be used in the next iteration
                // so it contains a list of properties.

                return Object.assign({}, a, {
                    [o]: s  
                })
        }, initialObject)
    },     

```


# Additional interesting Things
```javascript
isValidElement: c,
version: "16.5.0",
__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: {
    ReactCurrentOwner: M,
    assign: g
}



url: !0,
week: !0
}
, ta = ar.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED  // And this?
, na = /^(.*)[\\\/]/
, ra = "function" == typeof Symbol && Symbol.for


__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: {
    Events: [h, g, x, mr, w, function(e) {
        c(e, C)
    }
    , O, P, Te, A]
},


, function(e) {
    "use strict";
    // This is the function in index 80th
    e.exports = "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED"
}

```

# Game development


# Answers
# 1. Orientation challenge:
> What phrase is revealed when you answer all of the questions at the KringleCon Holiday Hack History kiosk inside the castle? For hints on achieving this objective, please visit Bushy Evergreen and help him with the Essential Editor Skills Cranberry Pi terminal challenge.

Method: Watched the video at https://www.youtube.com/watch?v=31JsKzsbFUo and entered the answers.
Answer: Happy Trails.

I think the page can be bruteforced as well.

# 2. Directory Browsing:
> Who submitted (First Last) the rejected talk titled Data Loss for Rainbow Teams: A Path in the Darkness? Please analyze the CFP site to find out. For hints on achieving this objective, please visit Minty Candycane and help her with the The Name Game Cranberry Pi terminal challenge.

1. Visit the site https://cfp.kringlecastle.com
2. Use DirBuster to find more directories: `docker run --rm hypnza/dirbuster -u https://cfp.kringlecastle.com/`
3. You'll notice there's a /cfp/cfp.html file, but there's also a /cpf/ directory. Such directory had an open listing.
4. Click on `https://cfp.kringlecastle.com/cfp/rejected-talks.csv`
5. Find the record for `Data Loss for Rainbow Teams: A Path in the Darkness`, the answer is `John,McClane`


# 3. de Bruijn Sequences
> When you break into the speaker unpreparedness room, what does Morcel Nougat say? For hints on achieving this objective, please visit Tangle Coalbox and help him with Lethal ForensicELFication Cranberry Pi terminal challenge.
Method: enter the protected room. Talk to the elf.
Answer: `Welcome unprepared speaker!`

Here is the [report](objectives/3_de_brujin_sequences.md)

# 4. Data Repo Analysis
> Retrieve the encrypted ZIP file from the North Pole Git repository. What is the password to open this file? For hints on achieving this objective, please visit Wunorse Openslae and help him with Stall Mucking Report Cranberry Pi terminal challenge.

Here is the [report](objectives/4_data_repo_analysis.md)

# 5. AD Privilege Discovery
> Using the data set contained in this SANS Slingshot Linux image, find a reliable path from a Kerberoastable user to the Domain Admins group. What’s the user’s logon name? Remember to avoid RDP as a control path as it depends on separate local privilege escalation flaws. For hints on achieving this objective, please visit Holly Evergreen and help her with the CURLing Master Cranberry Pi terminal challenge.

1. Ingest the .ova file in VirtualBox, and run the VM. I had a few issues running it, changed settings to Linux 64 instead of 32 and then it worked when starting it in "detached mode".
2. Run BloodHound in the VM
3. Watch the video Holly Evergreen provided, https://www.youtube.com/watch?v=gOpsLiJFI1o&feature=youtu.be
4. Once you've got BloodHound running, go to the Queries tab (top right) and click on "Shortest path to Domain Admins from Kerberoastable"
5. Click in the filter option and uncheck "CanRDP". The challenge says _remeber to avoid RDP..._ so that's what I've done.
6. If things went right, you should have `(Ldubej00320) -MemberOf-> (IT_00332) -AdminTo-> (Comp00185.ad.kringlecastle.com) -HasSession-> (JBetak00084) -MemberOf-> (Domain Admins)`
7. The logon name we need seems to be "Ldubej00320@ad.kringlecastle.com"

# 6. Badge Manipulation
> Bypass the authentication mechanism associated with the room near Pepper Minstix. A [sample employee badge](../assets/images/alabaster_badge.jpg) is available. What is the access control number revealed by the door authentication panel? For hints on achieving this objective, please visit Pepper Minstix and help her with the Yule Log Analysis Cranberry Pi terminal challenge.

Here is the [report](objectives/6_badge_manipulation.md)

# 9. Ransomware Recovery
> Alabaster Snowball is in dire need of your help. Santa's file server has been hit with malware. Help Alabaster Snowball deal with the malware on Santa's server by completing several tasks. For hints on achieving this objective, please visit Shinny Upatree and help him with the Sleigh Bell Lottery Cranberry Pi terminal challenge.

## Catch the Malware
> Assist Alabaster by building a Snort filter to identify the malware plaguing Santa's Castle.

Here's the [document](objectives/9a_snort_capture.md)


## Identify the Domain
> Using the Word docm file, identify the domain name that the malware communicates with.

Here's the [document](objectives/9b_malware_domain.md)


## Terminals
See [terminals](terminals.md)

# Piano lock
1. Looked at the source code. One of the top lines includes a font from Google: `<link href="https://fonts.googleapis.com/css?family=Gloria+Hallelujah" rel="stylesheet">`
2. The alphabet would be `C Csh D Dsh E Fsh G Gsh A Ash B Cc` (so 12 symbols) and the password length is 18.
3. There's an interesting Javascript snippet and an asset:
```html
<img class="banner" id="banner" src='images/key-of-d-banner.png' onMouseDown='this.style.visibility="hidden"'>
```
The image reads: `Now that's a good tune. But the key isn't right`

4. Maybe we need to use key of D?
> D major (or the key of D) is a major scale based on D, consisting of the pitches D, E, F♯, G, A, B, and C♯. Its key signature consists of two sharps. Its relative minor is B minor and its parallel minor is D minor.

Which means the symbols would be reduced to: `D E Fsh G A B Csh`, so 7 symbols.

5. Looking at the chords and lyrics of the song `Halleluja`:
```
         G                  Em
Now I've heard there was a secret chord
     G                      Em
That David played, and it pleased the Lord
    C                D                   G    D                
But you don't really care for music, do you?
   G                  C           D
It goes like this the fourth, the fifth
    Em              C      
The minor fall, the major lift
    D               B7          Em
The baffled king composing Hallelujah
     C           Em          C           G  D G  D
Hallelujah, Hallelujah, Hallelujah, Hallelu-u-jah

```




6. Note that `Em` appears in the song, but not in our alphabet. `Em = D#`; and `B7` will be played as `B`; converting the chords to (without lyrics):
`G Dsh G Dsh C D G D G C D Dsh C D B Dsh C Dsh C G D G D`. There are 23 chords to be played, but we have only 18 positions.


G Dsh G Dsh C D G D G C D Dsh C D B Dsh C Dsh C G D G D
5 2S  5 2S  1 2 5 2 5 1 2 2   1 2 7     1     1 5 2 5 2




Re-read the lyrics. The part of `the fourth` is below `C`. Start a sequence from `you (G)`; until the end there are 17 chords. So start one before and you'll have a sequence of 18 chords:
```
D G D G C D Dsh C D B Dsh C Dsh C G D G D
```

7. Make a request with that sequence:

```bash

SEQ="DGDGCDDshCDBDshCDshCGDGD";
curl "https://pianolock.kringlecastle.com/checkpass.php?i=$SEQ&resourceId=undefined" -v

```
It does not work...

8. Get the de Brujin sequence from [this site](http://www.hakank.org/comb/debruijn.cgi?k=7&n=18&submit=Ok) and build a JS array with it:
```
const chars = "0 0 0 1 0 0 2 0 0 3 0 0 4 0 0 5 0 0 6 0 1 1 0 1 2 0 1 3 0 1 4 0 1 5 0 1 6 0 2 1 0 2 2 0 2 3 0 2 4 0 2 5 0 2 6 0 3 1 0 3 2 0 3 3 0 3 4 0 3 5 0 3 6 0 4 1 0 4 2 0 4 3 0 4 4 0 4 5 0 4 6 0 5 1 0 5 2 0 5 3 0 5 4 0 5 5 0 5 6 0 6 1 0 6 2 0 6 3 0 6 4 0 6 5 0 6 6 1 1 1 2 1 1 3 1 1 4 1 1 5 1 1 6 1 2 2 1 2 3 1 2 4 1 2 5 1 2 6 1 3 2 1 3 3 1 3 4 1 3 5 1 3 6 1 4 2 1 4 3 1 4 4 1 4 5 1 4 6 1 5 2 1 5 3 1 5 4 1 5 5 1 5 6 1 6 2 1 6 3 1 6 4 1 6 5 1 6 6 2 2 2 3 2 2 4 2 2 5 2 2 6 2 3 3 2 3 4 2 3 5 2 3 6 2 4 3 2 4 4 2 4 5 2 4 6 2 5 3 2 5 4 2 5 5 2 5 6 2 6 3 2 6 4 2 6 5 2 6 6 3 3 3 4 3 3 5 3 3 6 3 4 4 3 4 5 3 4 6 3 5 4 3 5 5 3 5 6 3 6 4 3 6 5 3 6 6 4 4 4 5 4 4 6 4 5 5 4 5 6 4 6 5 4 6 6 5 5 5 6 5 6 6 6 0 0".split(' ');

const symbols = "D E Fsh G A B Csh".split(' ');
const chords = chars.map((charNumber) => {
    return symbols[charNumber];
})

console.log(chords);

chords.forEach((chord) => {
  notePress(chord);
})

```


# Solve the maze
The maze can be solved following the instructions [here](maze.md). You can also crawl it and build a map by yourself. Probably. I don't think the `hmac` hashes include any replay-attack protection.

#Badge Manipulation
> Bypass the authentication mechanism associated with the room near Pepper Minstix. A sample employee badge is available. What is the access control number revealed by the door authentication panel? For hints on achieving this objective, please visit Pepper Minstix and help her with the Yule Log Analysis Cranberry Pi terminal challenge.




> Nadie puede ser felíz si la sociedad en la que vive no es felíz.
> "Hay un punto en el cual tu propia felicidad podría ser cómplice en las causas por las cuales el rest de la sociedad la está pasando mal". Léase "Prefiero comer fideos todos los días que que vuelva la yegua"






# To Do List


# Identified services:
https://packalyzer.kringlecastle.com/ > See source code of the page, look around for comments
