# Pac-Man
### An implementation of Pac-Man as far as ghost behaviors, the map, and several other mechanics 

The idea for this project was to see if I could implement the ghost behaviors present in Pac-Man.
I added a few other mechanics along the way too. A final list of the main features include
- A full implementation of the map (barriers, dots, tunnels)
- Ghost seeking behaviors for all 4 ghosts
- A controllable player that can go around and eat dots
- Full animations for all ghosts and the main player
- Power pellets that trigger a change in ghost behavior and animation

I'm satisfied with the look and feel of the final product. I accomplished my goal going into this and
I learned a decent amount about how I should organize my code when I'm working on a project like this that I feel I can use in my other works.

## Background and Technologies
I started this project because I wanted to learn about how the Pac-Man ghosts work.
From an outside perspective, the ghosts seem to be abnormally smart in how they can trap you and I wanted to figure out *how*.
Even after I've coded their behavior I still don't understand how they can be so effective at doing what they do.

The beginning of this project started out with research about how the game works.
There were two main sources I used to advise devleopment for this project.
- [The Pac-Man Dossier](https://www.gamedeveloper.com/design/the-pac-man-dossier)
- [Strategy Wiki](https://strategywiki.org/wiki/Pac-Man)

The Pac-Man Dossier covered most of the mechanics I wanted to implement and the Strategy Wiki had most of the specifics that the Dossier did not.

For this project I used Typescript mainly on top of some basic CSS and HTML.
I used JS modules for this and it was actually the first time I used them in a meaningful way.
My main purpose for using modules was so that I could understand them better.
I started out wanting to use WebGL instead of the normal Context2D for interacting with the Canvas element, but decided against it after some testing.

## If I were to continue developing
While I do come out of this project with a better understanding of the ghost behavior, there are a few things I would add to the game to make it more complete.

The **main** thing I would do to make this feel like more of a game is have the ability for Pac-Man to kill ghosts and for the ghosts to kill Pac-Man.
Having the ghosts chase you in their signature style is great and all, but if all of the build up you get is for nothing, then it makes the game feel kind of empty.
Right now it's more of a showcase of their behaviors than anything else.

Next best thing to do is implement the Monster Pen that is at the center of the game board.
Right now I just have the ghosts spawning in at the corners.
That works fine, but if I want my game to feel more like the real Pac-Man then that is a must.
Doing this would also make killing ghosts feel more fulfilling I think. Because you're sending them somewhere? Just a feeling.

Aside from those features, there's also smaller things like making the power pellets disappear after you eat them or doing a better implementation of Pac-Man's cornering ability.
And of course there is also just a bugs that I have chosen to ignore because they don't impact that much about the game.
