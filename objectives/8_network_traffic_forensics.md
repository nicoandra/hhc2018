# 8. Network Traffic Forensics

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

9.

Interesting errors:

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
