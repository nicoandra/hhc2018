# Solve the maze
0. You might find your way out of the maze by either navigating it, or maybe by crawling it. However the best way is by having the map. To get the map, see the challenge number 4: Data Repo Analysis
1. When you get into the maze you start at position `(x, y, z) =  (23, 19, 1)` and looking in the _west_ direction.
2. I've started to write a software to crawl the maze (as it is the _Google_ maze, I thought it would be good to crawl it) but then found out the maps in the schematics ZIP file.
3. Converted the map to the right orientation and numbered each column and row. We know the orientation of the first floor, not necessarily the second one. See the [annotated version](assets/santas_castle_automation/ventilation_diagram/ventilation_diagram_1F_noted.jpg).

```
Up 6 times until you reach 17, 19.
Right, Up 2 times until you reach 17, 17
Left, Up 4 times until you reach 13, 17
Right, Up 4 times until you reach 13, 13
Right, Up 6 times until you reach 13, 19
Left, Up 2 times until you reach 19, 11
Left, Up 2 times until you reach 17, 11
Right, Up 2 times till 17, 9
Left, Up 2 times
Right, Up 4 times, you should have reached 15, 5 (Chrome will say you just left 15, 6)
Left + 2 Up till you reach 13, 5
Right, 2 Up till you reach 13, 3
Left, 4 up till you reach 9, 3
Right, 2 up till you reach 9, 1
Left, 6 up till you reach 3, 1
Left, 2 up till you reach 3, 3
Right, 2 up till you reach 1, 3
Right, 2 up till you reach the exit to the second floor. Click the arrow up.

You'll be heading north. So Right till you are facing East.
Up 8 times till you reach 9, 1
Right, Up 6 times till you reach 9, 7
Right, up 2 times
Left, up 2 times till you reach 7, 9
Right, up 2 times till you reach 5, 9
Left, up 4 times
Left, up 8 times.
Left, 2 up,
Right, 2 up.
Left, 2 up,
Right, 6 up till you reach 21, 9.
Left, 4 up.
Right, 2 up.
Right, 2 up.

Exit! If you did it in a separate tab you'll see "Congratulations!"
```
This will leave you in Santa's secret room.
