# SugarPlum Mary Linux Path terminal challenge

````
Oh me oh my - I need some help!

I need to review some files in my Linux terminal, but I can't get a file listing.

I know the command is ls, but it's really acting up.

Do you think you could help me out? As you work on this, think about these questions:

Do the words in green have special significance?
How can I find a file with a specific name?
What happens if there are multiple executables with the same name in my $PATH?
```


The terminal reads:

```
I need to list *file*s in my *home/*
To check on project logos
But what I see with *ls* there,
Are quotes from desert hobos...

*which* piece of my command does fail?
I surely cannot *find* it.
Make straight my *path* and *locate* that-
I'll praise your skill and sharp wit!

Get a listing (ls) of your current directory.
```

Ran `ls` and got:
`This isn't the ls you're looking for``

So typed `which ls` to get the path to an `ls` which wasn't the one I needed

Used `find / -name "ls"` to find all `ls` ; and one that came up is `/bin/ls`

Executed `/bin/ls` and got:

```
elf@2d31775362a9:~$ /bin/ls
' '   rejected-elfu-logos.txt
Loading, please wait......

You did it! Congratulations!

elf@2d31775362a9:~$ 
```

