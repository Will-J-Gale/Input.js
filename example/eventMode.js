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

Input.on('leftMouseDown', function(e){
    updateText("left mouse down")
})

Input.on('middleMouseDown', function(e){
    updateText("middle mouse down")
})

Input.on('rightMouseDown', function(e){
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
    updateText("moving mouse " + "X Velocity: " + Input.velocity.x + " Y Velocity: " + Input.velocity.y)
})
Input.on('mouseWheel', function(delta){
    if(delta > 0)
        updateText("mouse wheel move down")
    else 
        updateText("mouse wheel move up")
})

Input.on('doubleClick', function(){
    updateText("Double Click");
})

Input.on('touch', function(){
    updateText("Touch start")
})
Input.on('touchMove', function(){
    updateText("Touch Move " + "X: " + Input.velocity.x + " Y Velocity: " + Input.velocity.y)
})
Input.on('touchEnd', function(){
    updateText("Touch end")
})
Input.on("touchHeld", function(){
    updateText("Touch Held")
})

