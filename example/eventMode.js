Input.initialize({eventMode: true});

var text = document.getElementById("prefix");

function updateText(string)
{
    text.innerHTML = "Input: " + string
}

//Setting what happens on input
Input.on('keydown', function(key){
    updateText(key + " down");
})

Input.on('keyup', function(key){
    updateText(key + " up");
})

Input.on('leftClick', function(e){
    updateText("left mouse down")
})

Input.on('middleClick', function(e){
    updateText("middle mouse down")
})

Input.on('rightClick', function(e){
    updateText("right mouse down")
})

Input.on('leftMouseUp', function(e){
    updateText("left mouse up")
})

Input.on('middleMouseUp', function(e){
    updateText("middle mouse up")
})

Input.on('rightMouseUp', function(e){
    updateText("right mouse up")
})

Input.on('mouseMove', function(e){
    updateText("moving mouse " + "X Velocity: " + Input.mouseVelocity.x + "Y Velocity: " + Input.mouseVelocity.y)
})
Input.on('mouseWheel', function(e){
    if(e.deltaY > 0)
        updateText("mouse wheel move down")
    else 
        updateText("mouse wheel move up")
})


