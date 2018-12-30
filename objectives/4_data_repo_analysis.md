
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
