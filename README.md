# CS 174A Final Project

## Team members:  
Su Yong Won (205331999) \
Marie Chu  (905116878)\
Changhui Youn  (304207830)  
Yijing Zhou (404786693)  


####*Mirrors:*
Marie Chu & Yijing Zhou

#####Brief Description
This scene simulates funhouses mirrors at the carnival, including a plane mirror, concave mirror, and convex mirror.  
Using the mirror equation: 
![Image description](https://www.physicstutorials.org/images/stories/mirrorequations2.png)
The player can move around the with arrow keys as a mouse scuttles by.

![Image](mirror.jpg)

#####Advanced Features
This scene includes advanced features such as reflections. With the plane mirror the magnification of the 
image is 1. In the right mirror (concave) when the image is in front of the focal point the image is inverted and 
becomes larger the closer it gets to the focal point and becomes right side up when it passes the focal point. For the 
left mirror (convex) the image is always upright, reduced and virtual. 

Another feature in this scene is shadowing. The avatar's shadow becomes elongated as the object moves further from the 
light source and larger as the object gets closer to the light source in the upwards direction.

There is also simple collision detection to make sure the user does not go through the walls when moving avatars position.



####*Darts:*
Su Yong Won & Changhui Youn
#####Brief Description
This scene simulates a Dart game in which a user can aim and shoot at a target. It simulates the effect of wind and gravity on the path of the projectile. There is also a descriptor box that keeps track of the score and additional descriptors for the shot such as wind speed, direction, etc. If the user hits a bulls-eye, fireworks will go off. After completing 3 levels, the user will receive a mousetrap that they can use to trap the mouse in the mirror room.

![Image](dart.jpg)



#####Advanced Features
- Collision detection to determine if the dart hit the target and calculates the score according to where on the target the dart hit. 
- Flag, which waves depending on the speed of the wind
- Firework effect using particles on bulls-eye
- 3D Motion Projection with gravity and wind

 ####*Main Scene:*
#####Brief Description
The Main scene navigates between the two scenes and includes the implementation of simple fireworks in the background.
![Image](main.png)
#####References
This code was referenced to implement a fragment and vertex shader in the dart game's flag.

https://jsfiddle.net/63sj1rpk/53/



