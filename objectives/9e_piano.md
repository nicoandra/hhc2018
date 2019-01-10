1. Alabaster's password is a composition from Rachmaninoff:
> I'm seriously impressed by your security skills. How could I forget that I used Rachmaninoff as my musical password?
`$notes = ['E','D#', 'E','D#',
        'E','E','D#','E',
        'F#','G#','F#','G#',
        'A','B','A#','B',
        'A#','B'];`

2.  Play it, and the pop appears...
3. Transpose it to key of D, as the message seems to be (the URL of the popup is `https://pianolock.kringlecastle.com/images/key-of-d-banner.png`)
4. The result is:

5. Made a Curl call to validate:
```
curl https://pianolock.kringlecastle.com/checkpass.php\?resourceId\=875d0dce-1bfe-4c4f-9b9c-17b76445d4c2\&i\=DCshDCshDDCshDEFshEFshGAGshAGshA
{"success":true,"resourceId":"875d0dce-1bfe-4c4f-9b9c-17b76445d4c2","hash":"96b04af159dd0e36946e891b571a30d9ae65c07619f8cd90da3a232e0dfde984","message":"Correct guess!"}
```

6. Ran this in the Chrome Console:

```javascript
__POST_RESULTS__({
                hash: "96b04af159dd0e36946e891b571a30d9ae65c07619f8cd90da3a232e0dfde984",
                resourceId: "875d0dce-1bfe-4c4f-9b9c-17b76445d4c2",
              });
```

7. Door opened!
