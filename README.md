# hhc2018

Notes on the holiday hack challenge.

# SPOILERS AHEAD
If you don't want the spoilers, please STOP READING now.

# Contact and contribution
- Clone, make a PR, good to go.
- Contact me at @imsonico over Twitter ;

# Dependencies:
- Nodejs

# Basic setup you need
- Burp or ZAP Proxy; I use Burp. Any proxy which lets you manipulate WebSockets will do.
- Chromium browser configured to use your proxy as listed in the previous point.
- The Proxy SSL certificate installed in Chromium.


- Why Chromium? Because the Javascript debugger actually works and you'll need to debug Javascript code.

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

The interface lets you pick a number between 0 and 8, being these:
- 0: AT AT
- 1: AT TA
- 2: AT GC
- 3: AT CG
- 4: TA AT
- 5: TA TA
- 6: TA GC
- 7: TA CG
- 8: GC AT

All these are using 4 characters, but we've seen above we can use up to 8; which means that GC AT AT AT would still be a valid "torso".



The DNA needs to contain the numbers mapped only. So AT, TA, CG, GC. There's a DNA listed [here](https://www.ncbi.nlm.nih.gov/Class/MLACourse/Modules/BLAST/q_jurassicparkDNA.html) which won't work because it contains non-accepted symbols, like TT.

The decoding function reads as follows:
`decodeDNASequence: e => b.unpack((e.match(/..?/g) || []).map(e => h[e]).join(""), 4),`


Deobfuscated would be (not tested):

`decodeDNASequence: (e) => {

  const parts = (e.match(/..?/g) || []); // Maps becomes an array like [ ['AT'], ['AT'], ['TA'] ... ], 60 pairs of characters.
  const numbers = parts.map((pair) => { return h[pair]; }); // H is the list of mappings, see above. Now numbers became a list like [[0], [0], [1], ... ]
  const stringOfNumbers = numbers.join(""); // Glue them all together
  return b.unpack(stringOfNumbers, 4);  //
}
`


See [legs](assets/images/avatars/legs_full_boards.png?raw=true) and [torso](assets/images/avatars/torso_full_boards.png?raw=true) images. Both images include 3 additional transparent sections. It seems the options:

legs: 9, 10 11
torso: 9, 10, 11

Appear in the image, but are not available in the interface. The allowed values in the interface are 0 to 8.




* Interesting files
- There's a badge.png in images
- Currently working on a deobfuscated version of main.js ; which I'm using in Chrome to test. Some variables (like the socket) are exposed to the global scope, being available to play with straight from the Chrome console.

# DNA Validation

I've deobfuscated the validateSequence function. Original:
```
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


 decodeDNASequence: e=>b.unpack( (e.match(/..?/g) || []) .map(e=>h[e]).join(""), 4)
 

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

Deobfuscated:
```
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

            // if (Object(i.includes)(Object.keys(A), t)) // this if is reworked below
            const validProperties = Object.keys(A);

            if (validProperties.includes(t)){
                if(0 > e){ return true; }           // e needs to be 0 or greater
            
                /* Counts are:
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

            const condA = 0 > e;

            let compar = Array(n.size + 1).join("1");
            compar = parseInt(compar, 2).toString(10);
            // For n.size = 4   => compar = 11111       =>
            // For n.size = 8   => compar = 111111111   =>

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

