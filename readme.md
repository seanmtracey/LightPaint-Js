#LightPaint-Js
#####Using a torch, getUserMedia and canvas, you can paint objects in your browser!

###Usage
Pretty simple, just download the code and open index.html, hit the start button, enable access to the webcam and then wave a torch (the one on your phone will do the job) in front of the screen. Face the torch towards the screen, where you move the light source in space is where the shapes will be drawn on the screen

###How does it work?
There's no object tracking in LightPaint. All that's going on is the webcam feed is being drawn onto a canvas, then we work out where all of the white pixels are (the light source), color in those pixels with another color and then create a reference to them in another array which gives the pixel an age.

If a pixels hasn't been painted in over 5 seconds, it will turn black again.