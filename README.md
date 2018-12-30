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

# Gates
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

_What phrase is revealed when you answer all of the questions at the KringleCon Holiday Hack History kiosk inside the castle? For hints on achieving this objective, please visit Bushy Evergreen and help him with the Essential Editor Skills Cranberry Pi terminal challenge._

Method: Watched the video at https://www.youtube.com/watch?v=31JsKzsbFUo and entered the answers.

Answer: Happy Trails

# 2. Directory Browsing:
Who submitted (First Last) the rejected talk titled Data Loss for Rainbow Teams: A Path in the Darkness? Please analyze the CFP site to find out. For hints on achieving this objective, please visit Minty Candycane and help her with the The Name Game Cranberry Pi terminal challenge.


1. Visit the site https://cfp.kringlecastle.com
2. Use DirBuster to find more directories: `docker run --rm hypnza/dirbuster -u https://cfp.kringlecastle.com/`
3. You'll notice there's a /cfp/cfp.html file, but there's also a /cpf/ directory. Such directory had an open listing.
4. Click on `https://cfp.kringlecastle.com/cfp/rejected-talks.csv`
5. Find the record for `Data Loss for Rainbow Teams: A Path in the Darkness`, the answer is `John,McClane`


# 3. de Bruijn Sequences
Method: enter the protected room. Talk to the elf.
Answer: `Welcome unprepared speaker!`

# 4. Data Repo Analysis
Difficulty:
Retrieve the encrypted ZIP file from the North Pole Git repository. What is the password to open this file? For hints on achieving this objective, please visit Wunorse Openslae and help him with Stall Mucking Report Cranberry Pi terminal challenge.





# 5. AD Privilege Discovery
Difficulty:
Using the data set contained in this SANS Slingshot Linux image, find a reliable path from a Kerberoastable user to the Domain Admins group. What’s the user’s logon name? Remember to avoid RDP as a control path as it depends on separate local privilege escalation flaws. For hints on achieving this objective, please visit Holly Evergreen and help her with the CURLing Master Cranberry Pi terminal challenge.



## Terminals
See [terminals](terminals.md)

## Challenges:




# Enter the Code to Unlock the Door
1. Characters are: Triangle, Square, Circle and Star.
2. 4 characters * 4 positions = 4^4 = 256 options
3. Get the de Brujin sequence:
`0 0 0 0 1 0 0 0 2 0 0 0 3 0 0 1 1 0 0 1 2 0 0 1 3 0 0 2 1 0 0 2 2 0 0 2 3 0 0 3 1 0 0 3 2 0 0 3 3 0 1 0 1 0 2 0 1 0 3 0 1 1 1 0 1 1 2 0 1 1 3 0 1 2 1 0 1 2 2 0 1 2 3 0 1 3 1 0 1 3 2 0 1 3 3 0 2 0 2 0 3 0 2 1 1 0 2 1 2 0 2 1 3 0 2 2 1 0 2 2 2 0 2 2 3 0 2 3 1 0 2 3 2 0 2 3 3 0 3 0 3 1 1 0 3 1 2 0 3 1 3 0 3 2 1 0 3 2 2 0 3 2 3 0 3 3 1 0 3 3 2 0 3 3 3 1 1 1 1 2 1 1 1 3 1 1 2 2 1 1 2 3 1 1 3 2 1 1 3 3 1 2 1 2 1 3 1 2 2 2 1 2 2 3 1 2 3 2 1 2 3 3 1 3 1 3 2 2 1 3 2 3 1 3 3 2 1 3 3 3 2 2 2 2 3 2 2 3 3 2 3 2 3 3 3 3 (0 0 0) `
4. Convert it to a Javascript array:
```javascript
let chars = "0 0 0 0 1 0 0 0 2 0 0 0 3 0 0 1 1 0 0 1 2 0 0 1 3 0 0 2 1 0 0 2 2 0 0 2 3 0 0 3 1 0 0 3 2 0 0 3 3 0 1 0 1 0 2 0 1 0 3 0 1 1 1 0 1 1 2 0 1 1 3 0 1 2 1 0 1 2 2 0 1 2 3 0 1 3 1 0 1 3 2 0 1 3 3 0 2 0 2 0 3 0 2 1 1 0 2 1 2 0 2 1 3 0 2 2 1 0 2 2 2 0 2 2 3 0 2 3 1 0 2 3 2 0 2 3 3 0 3 0 3 1 1 0 3 1 2 0 3 1 3 0 3 2 1 0 3 2 2 0 3 2 3 0 3 3 1 0 3 3 2 0 3 3 3 1 1 1 1 2 1 1 1 3 1 1 2 2 1 1 2 3 1 1 3 2 1 1 3 3 1 2 1 2 1 3 1 2 2 2 1 2 2 3 1 2 3 2 1 2 3 3 1 3 1 3 2 2 1 3 2 3 1 3 3 2 1 3 3 3 2 2 2 2 3 2 2 3 3 2 3 2 3 3 3 3 0 0 0".split(' ')
```
5. Loop through the array, pressing each of the buttons:
```javascript
chars.forEach((thisChar) => { addShape(thisChar) })
```
6. Running the code will make XHR requests for each attempt; all of them returning `{"success":false,"message":"Incorrect guess."}`; except:
`https://doorpasscode.kringlecastle.com/checkpass.php?i=0120&resourceId=d3f52771-16c0-40c1-91f2-383d1667b4d5` which will return:

`{"success":true,"resourceId":"d3f52771-16c0-40c1-91f2-383d1667b4d5","hash":"01ea8727dec2cf58a9f7557a40cecc971d670f47d40d3940e901e97b0f885b26","message":"Correct guess!"}`


# Data repo analysis
There is a ZIP file to find.
1. Git clone the repo: `git clone https://git.kringlecastle.com/Upatree/santas_castle_automation`
2. Run `find . -name "*.zip"` to find `./schematics/ventilation_diagram.zip`
3. The hint says to talk to Stall Mucking Report; who says:
> Speaking of good ways to find credentials, have you heard of Trufflehog? It's a cool way to dig through repositories for passwords, RSA keys, and more.
> I mean, no one EVER uploads sensitive credentials to public repositories, right? But if they did, this would be a great tool for finding them.
> But hey, listen to me ramble. If you're interested in Trufflehog, you should check out Brian Hostetler's talk!
> Have you tried the entropy=True option when running Trufflehog? It is amazing how much deeper it will dig!

4. Ran TruffleHog a few times:

```
root@c3c48536ad5c:/data# trufflehog --regex --entropy false ${REPO_PATH}

~~~~~~~~~~~~~~~~~~~~~
Reason: RSA private key
Date: 2018-12-11 08:29:03
Hash: 7f46bd5f88d0d5ac9f68ef50bebb7c52cfa67442
Filepath: schematics/files/dot/ssh/key.rsa
Branch: master
Commit: cleaning files
-----BEGIN RSA PRIVATE KEY-----
~~~~~~~~~~~~~~~~~~~~~
~~~~~~~~~~~~~~~~~~~~~
Reason: RSA private key
Date: 2018-12-11 07:25:21
Hash: 714ba109e573f37a6538beeeb7d11c9391e92a72
Filepath: schematics/files/dot/ssh/key.rsa
Branch: master
Commit: support files for Santa''s drone functions

-----BEGIN RSA PRIVATE KEY-----


root@c3c48536ad5c:/data# trufflehog --regex --entropy true ${REPO_PATH}

Reason: High Entropy
Date: 2018-12-11 08:25:45
Hash: e76cb9adf58ec335d86355feb8dec3c74b9edcfe
Filepath: schematics/for_elf_eyes_only.md
Branch: master
Commit: removing file
@@ -0,0 +1,15 @@
+Our Lead InfoSec Engineer Bushy Evergreen has been noticing an increase of brute force attacks in our logs. Furthermore, Albaster discovered
and published a vulnerability with our password length at the last Hacker Conference.
+
+Bushy directed our elves to change the password used to lock down our sensitive files to something stronger. Good thing he caught it before t
hose dastardly villians did!
+
+
+Hopefully this is the last time we have to change our password again until next Christmas.
+
+Password = 'Yippee-ki-yay'
+
+Change ID = 'ESC[93m9ed54617547cfca783e0f81f8dc5c927e3d1e3'

Reason: High Entropy
Date: 2018-12-11 07:25:21
Hash: 714ba109e573f37a6538beeeb7d11c9391e92a72
Filepath: support_files/spec/support/Mstrctr.js
Branch: master
Commit: support files for Santa''s drone functions

@@ -1,5 +0,0 @@
-
-module.export.addNote = function () {
-      console.log('Secret Key');
-      return 'mwPu4Ry8FBhckXWjCfjx5QlkRR8vcAqLBf6sgmrcjwFv0c1xjMUw1Qh+rWVQZTTRP';
- };

Reason: High Entropy
Date: 2018-12-11 07:23:36
Hash: 5f4f64140ee1388b4cccee577a6afd0b797bfff3
Filepath: schematics/files/dot/PW/for_elf_eyes_only.md
Branch: master
Commit: removing accidental commit
@@ -0,0 +1,15 @@
+Our Lead InfoSec Engineer Bushy Evergreen has been noticing an increase of brute force attacks in our logs. Furthermore, Albaster discovered and published a vulnerability with our password length at the last Hacker Conference.
+
+Bushy directed our elves to change the password used to lock down our sensitive files to something stronger. Good thing he caught it before those dastardly villians did!
+Hopefully this is the last time we have to change our password again until next Christmas.
+Password = 'Yippee-ki-yay'
+Change ID = '93m9ed54617547cfca783e0f81f8dc5c927e3d1e3'
```

4. Special mention for https://git.kringlecastle.com/Upatree/santas_castle_automation/blob/master/schematics/EE3.jpg
5. Try to open the zip file with the password `Yippee-ki-yay` and find the maps for the [first](assets/santas_castle_automation/ventilation_diagram/ventilation_diagram_1F.jpg) and [second](assets/santas_castle_automation/ventilation_diagram/ventilation_diagram_2F.jpg) floor of the vents maze.





#AD Privilege Discovery
> Using the data set contained in this SANS Slingshot Linux image, find a reliable path from a Kerberoastable user to the Domain Admins group. What’s the user’s logon name? Remember to avoid RDP as a control path as it depends on separate local privilege escalation flaws. For hints on achieving this objective, please visit Holly Evergreen and help her with the CURLing Master Cranberry Pi terminal challenge.

# Solve the maze
The maze can be solved following the instructions [here](maze.md).


#Badge Manipulation
> Bypass the authentication mechanism associated with the room near Pepper Minstix. A sample employee badge is available. What is the access control number revealed by the door authentication panel? For hints on achieving this objective, please visit Pepper Minstix and help her with the Yule Log Analysis Cranberry Pi terminal challenge.




> Nadie puede ser felíz si la sociedad en la que vive no es felíz.
> "Hay un punto en el cual tu propia felicidad podría ser cómplice en las causas por las cuales el rest de la sociedad la está pasando mal". Léase "Prefiero comer fideos todos los días que que vuelva la yegua"






# To Do List


# Identified services:
https://packalyzer.kringlecastle.com/ > See source code of the page, look around for comments
