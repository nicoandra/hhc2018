# Enter the Code to Unlock the Door
> When you break into the speaker unpreparedness room, what does Morcel Nougat say? For hints on achieving this objective, please visit Tangle Coalbox and help him with Lethal ForensicELFication Cranberry Pi terminal challenge.


1. Characters are: Triangle, Square, Circle and Star.

2. 4 characters * 4 positions = `4^4 = 256` options

3. Get the de Brujin sequence from http://www.hakank.org/comb/debruijn.cgi by entering `k=4` (alphabet size) and `n=4` (word length). You'll get this sequence:
```
0 0 0 0 1 0 0 0 2 0 0 0 3 0 0 1 1 0 0 1 2 0 0 1 3 0 0
2 1 0 0 2 2 0 0 2 3 0 0 3 1 0 0 3 2 0 0 3 3 0 1 0 1 0
2 0 1 0 3 0 1 1 1 0 1 1 2 0 1 1 3 0 1 2 1 0 1 2 2 0 1
2 3 0 1 3 1 0 1 3 2 0 1 3 3 0 2 0 2 0 3 0 2 1 1 0 2 1
2 0 2 1 3 0 2 2 1 0 2 2 2 0 2 2 3 0 2 3 1 0 2 3 2 0 2
3 3 0 3 0 3 1 1 0 3 1 2 0 3 1 3 0 3 2 1 0 3 2 2 0 3 2
3 0 3 3 1 0 3 3 2 0 3 3 3 1 1 1 1 2 1 1 1 3 1 1 2 2 1
1 2 3 1 1 3 2 1 1 3 3 1 2 1 2 1 3 1 2 2 2 1 2 2 3 1 2
3 2 1 2 3 3 1 3 1 3 2 2 1 3 2 3 1 3 3 2 1 3 3 3 2 2 2
2 3 2 2 3 3 2 3 2 3 3 3 3 (0 0 0)
```

4. Remove the parenthesis and convert it to a Javascript array:
```javascript
let chars =
"0 0 0 0 1 0 0 0 2 0 0 0 3 0 0 1 1 0 0 1 2 0 0 1 3 0 0 2 1 0 0 2 2 0 0 2 3 0 0 3 1 0 0 3 2 0 0 3 3 0 1 0 1 0 2 0 1 0 3 0 1 1 1 0 1 1 2 0 1 1 3 0 1 2 1 0 1 2 2 0 1 2 3 0 1 3 1 0 1 3 2 0 1 3 3 0 2 0 2 0 3 0 2 1 1 0 2 1 2 0 2 1 3 0 2 2 1 0 2 2 2 0 2 2 3 0 2 3 1 0 2 3 2 0 2 3 3 0 3 0 3 1 1 0 3 1 2 0 3 1 3 0 3 2 1 0 3 2 2 0 3 2 3 0 3 3 1 0 3 3 2 0 3 3 3 1 1 1 1 2 1 1 1 3 1 1 2 2 1 1 2 3 1 1 3 2 1 1 3 3 1 2 1 2 1 3 1 2 2 2 1 2 2 3 1 2 3 2 1 2 3 3 1 3 1 3 2 2 1 3 2 3 1 3 3 2 1 3 3 3 2 2 2 2 3 2 2 3 3 2 3 2 3 3 3 3 0 0 0"
.split(' ')
```

5. Note the source code has a JavaScript function named `addShape`, which will do XHR requests. Loop through the array with all symbols and press each of the buttons:
```javascript
chars.forEach((thisChar) => { addShape(thisChar) })
```

6. Running the code will make XHR requests for each attempt; all of them returning `{"success":false,"message":"Incorrect guess."}`; except one of them:
`https://doorpasscode.kringlecastle.com/checkpass.php?i=0120&resourceId=d3f52771-16c0-40c1-91f2-383d1667b4d5` which will return:

```JSON
{ "success":true,
  "resourceId":"d3f52771-16c0-40c1-91f2-383d1667b4d5",
  "hash":"01ea8727dec2cf58a9f7557a40cecc971d670f47d40d3940e901e97b0f885b26",
  "message":"Correct guess!"}
```

7. The code seems to be `0120`. Enter the code in the lock and you're done.
