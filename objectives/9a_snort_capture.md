


1. Using `tshark` to read the live dump:

```bash
tshark -r snort.log.pcap
[...]
369   3.757481  10.126.0.77 ? 249.45.38.114 DNS 102 Standard query 0xf1b9 TXT 60.77616E6E61636F6F6B69652E6D696E2E707331.rughrenbas.com
370   3.767650 249.45.38.114 ? 10.126.0.77  DNS 425 Standard query response 0xf1b9 TXT 60.77616E6E61636F6F6B69652E6D696E2E707331.rughrenbas.com TXT
371   3.777851  10.126.0.50 ? 172.217.15.99 DNS 88 Standard query 0x04c5 TXT overbuilt.trilaurin.rubberize.google.co.uk
372   3.788043 172.217.15.99 ? 10.126.0.50  DNS 195 Standard query response 0x04c5 TXT overbuilt.trilaurin.rubberize.google.co.uk TXT
373   3.798252 10.126.0.157 ? 123.125.115.110 DNS 89 Standard query 0x12d7 TXT unanswerably.chilmark.approximate.baidu.com
374   3.808420 123.125.115.110 ? 10.126.0.157 DNS 207 Standard query response 0x12d7 TXT unanswerably.chilmark.approximate.baidu.com TXT
375   3.818638  10.126.0.77 ? 249.45.38.114 DNS 102 Standard query 0xa344 TXT 61.77616E6E61636F6F6B69652E6D696E2E707331.rughrenbas.com
376   3.828823 249.45.38.114 ? 10.126.0.77  DNS 425 Standard query response 0xa344 TXT 61.77616E6E61636F6F6B69652E6D696E2E707331.rughrenbas.com TXT
377   3.839022 10.126.0.192 ? 81.80.187.144 DNS 101 Standard query 0xe6b9 TXT 61.77616E6E61636F6F6B69652E6D696E2E707331.gunarbehrs.ru
378   3.849195 81.80.187.144 ? 10.126.0.192 DNS 423 Standard query response 0xe6b9 TXT 61.77616E6E61636F6F6B69652E6D696E2E707331.gunarbehrs.ru TXT
379   3.859401  10.126.0.77 ? 249.45.38.114 DNS 102 Standard query 0xafd1 TXT 62.77616E6E61636F6F6B69652E6D696E2E707331.rughrenbas.com
380   3.869598 249.45.38.114 ? 10.126.0.77  DNS 425 Standard query response 0xafd1 TXT 62.77616E6E61636F6F6B69652E6D696E2E707331.rughrenbas.com TXT
381   3.879824 10.126.0.142 ? 123.126.157.222 DNS 69 Standard query 0x1501 TXT preoffering.sina.com.cn
382   3.890015 123.126.157.222 ? 10.126.0.142 DNS 118 Standard query response 0x1501 TXT preoffering.sina.com.cn TXT
383   3.900238 10.126.0.192 ? 81.80.187.144 DNS 101 Standard query 0x02f7 TXT 62.77616E6E61636F6F6B69652E6D696E2E707331.gunarbehrs.ru
384   3.910416 81.80.187.144 ? 10.126.0.192 DNS 423 Standard query response 0x02f7 TXT 62.77616E6E61636F6F6B69652E6D696E2E707331.gunarbehrs.ru TXT
385   3.920621 10.126.0.192 ? 81.80.187.144 DNS 101 Standard query 0x3a62 TXT 63.77616E6E61636F6F6B69652E6D696E2E707331.gunarbehrs.ru
386   3.930800 81.80.187.144 ? 10.126.0.192 DNS 195 Standard query response 0x3a62 TXT 63.77616E6E61636F6F6B69652E6D696E2E707331.gunarbehrs.ru TXT
387   3.940991  10.126.0.77 ? 249.45.38.114 DNS 102 Standard query 0x9a4c TXT 63.77616E6E61636F6F6B69652E6D696E2E707331.rughrenbas.com
388   3.951167 249.45.38.114 ? 10.126.0.77  DNS 197 Standard query response 0x9a4c TXT 63.77616E6E61636F6F6B69652E6D696E2E707331.rughrenbas.com TXT
389   3.961376 10.126.0.229 ? 183.79.135.206 DNS 78 Standard query 0xff0b TXT prynne.untremblingly.yahoo.co.jp
390   3.971555 183.79.135.206 ? 10.126.0.229 DNS 146 Standard query response 0xff0b TXT prynne.untremblingly.yahoo.co.jp TXT
```

2. Getting the PCAP from the webserver we can get more information:

```bash
0000   45 00 01 9d 00 01 00 00 40 11 01 48 d0 e0 9b ce   E.......@..HÐà.Î
0010   0a 7e 00 db 00 35 5c ad 01 89 a9 64 f4 fc 84 00   .~.Û.5\...©dôü..
0020   00 01 00 01 00 00 00 00 01 36 26 37 37 36 31 36   .........6&77616
0030   45 36 45 36 31 36 33 36 46 36 46 36 42 36 39 36   E6E61636F6F6B696
0040   35 32 45 36 44 36 39 36 45 32 45 37 30 37 33 33   52E6D696E2E70733
0050   31 06 72 62 75 72 67 65 02 72 75 00 00 10 00 01   1.rburge.ru.....
0060   01 36 26 37 37 36 31 36 45 36 45 36 31 36 33 36   .6&77616E6E61636
0070   46 36 46 36 42 36 39 36 35 32 45 36 44 36 39 36   F6F6B69652E6D696
0080   45 32 45 37 30 37 33 33 31 06 72 62 75 72 67 65   E2E707331.rburge
0090   02 72 75 00 00 10 00 01 00 00 02 58 00 ff fe 35   .ru........X.ÿþ5
00a0   33 35 37 32 65 35 37 37 32 36 39 37 34 36 35 32   3572e57726974652
00b0   38 32 34 34 31 34 35 35 33 35 30 32 65 34 39 35   824414553502e495
00c0   36 32 63 32 30 33 30 32 63 32 30 32 34 34 31 34   62c20302c2024414
00d0   35 35 33 35 30 32 65 34 39 35 36 32 65 34 63 36   553502e49562e4c6
00e0   35 36 65 36 37 37 34 36 38 32 39 33 62 32 34 35   56e677468293b245
00f0   34 37 32 36 31 36 65 37 33 36 36 36 66 37 32 36   472616e73666f726
0100   64 32 30 33 64 32 30 32 34 34 31 34 35 35 33 35   d203d20244145535
0110   30 32 65 34 33 37 32 36 35 36 31 37 34 36 35 34   02e4372656174654
0120   35 36 65 36 33 37 32 37 39 37 30 37 34 36 66 37   56e63727970746f7
0130   32 32 38 32 39 37 64 32 30 36 35 36 63 37 33 36   228297d20656c736
0140   35 32 30 37 62 35 62 34 32 37 39 37 34 36 35 35   5207b5b427974655
0150   62 35 64 35 64 32 34 34 63 36 35 36 65 34 39 35   b5d5d244c656e495
0160   36 32 30 33 64 32 30 34 65 36 35 37 37 32 64 34   6203d204e65772d4
0170   66 36 32 36 61 36 35 36 33 37 34 32 30 34 32 37   f626a65637420427
0180   39 37 34 36 35 35 62 35 64 32 30 33 34 33 62 32   974655b5d20343b2
0190   34 34 36 36 39 36 63 36 35 35 33 35 32            446696c655352
```

The response seems to contain a response at the end:
```bash
0000   35 33 35 37 32 65 35 37 37 32 36 39 37 34 36 35
0010   32 38 32 34 34 31 34 35 35 33 35 30 32 65 34 39
0020   35 36 32 63 32 30 33 30 32 63 32 30 32 34 34 31
0030   34 35 35 33 35 30 32 65 34 39 35 36 32 65 34 63
0040   36 35 36 65 36 37 37 34 36 38 32 39 33 62 32 34
0050   35 34 37 32 36 31 36 65 37 33 36 36 36 66 37 32
0060   36 64 32 30 33 64 32 30 32 34 34 31 34 35 35 33
0070   35 30 32 65 34 33 37 32 36 35 36 31 37 34 36 35
0080   34 35 36 65 36 33 37 32 37 39 37 30 37 34 36 66
0090   37 32 32 38 32 39 37 64 32 30 36 35 36 63 37 33
00a0   36 35 32 30 37 62 35 62 34 32 37 39 37 34 36 35
00b0   35 62 35 64 35 64 32 34 34 63 36 35 36 65 34 39
00c0   35 36 32 30 33 64 32 30 34 65 36 35 37 37 32 64
00d0   34 66 36 32 36 61 36 35 36 33 37 34 32 30 34 32
00e0   37 39 37 34 36 35 35 62 35 64 32 30 33 34 33 62
00f0   32 34 34 36 36 39 36 63 36 35 35 33 35 32
```

3. The plan would be to alert on DNS queries resolving any hostname which contains `77616E6E61636F6F6B69652E6D696E2E707331`.

4. Following [these instructions](https://paginas.fe.up.pt/~mgi98020/pgr/writing_snort_rules.htm#Basics), build the rule.

`Action, protocol, Source Ip, Source port, Direction Operator, Destination Ip, Destination port, `

We want to alert on DNS traffic, so outgoing UDP packets to port 53, when the payload size is greater than 70 bytes, and containing `77616E6E61636F6F6B69652E6D696E2E707331` (in binary) .
Looking for payload size first for performance reasons, as it's cheaper than looking at the package content itself.

`37 37 36 31 36 45 36 45 36 31 36 33 36 46 36 46 36 42 36 39 36 35 32 45 36 44 36 39 36 45 32 45 37 30 37 33 33 31`

For outgoing traffic:
```
alert udp 10.126.0.0/24 any -> any 53 (dsize: >20; content:"|37 37 36 31 36 45 36 45 36 31 36 33 36 46 36 46 36 42 36 39 36 35 32 45 36 44 36 39 36 45 32 45 37 30 37 33 33 31|"; sid: 10000001)
alert udp any 53 -> 10.126.0.0/24 any (dsize: >100; content:"|37 37 36 31 36 45 36 45 36 31 36 33 36 46 36 46 36 42 36 39 36 35 32 45 36 44 36 39 36 45 32 45 37 30 37 33 33 31|"; sid: 10000002)
```

5. The test passes: `[+] Congratulation! Snort is alerting on all ransomware and only the ransomware!`