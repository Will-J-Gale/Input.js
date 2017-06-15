Input.initialize();

var text = document.getElementById("prefix");

function updateText(string)
{
    text.innerHTML = "Input: " + string
}

var render = function () {
    requestAnimationFrame( render );

    //Setting what happens on input
    if(Input.hasPressedKeyDown)
        updateText(Input.currentPressedKeyDown + " down")
    else if(Input.hasPressedKeyUp)
        updateText(Input.currentPressedKeyUp + " up");
    else if(Input.getMouseDown("left"))
        updateText("mouse down left")
    else if(Input.getMouseDown("middle"))
        updateText("mouse down middle")
    else if(Input.getMouseDown("right"))
        updateText("mouse down right")
    else if(Input.getMouseUp("left"))
        updateText("mouse up left")
    else if(Input.getMouseUp("middle"))
        updateText("mouse up middle")
    else if(Input.getMouseUp("right"))
        updateText("mouse up right")  

    if(Input.mouseVelocity.x != 0 || Input.mouseVelocity.y != 0)
        updateText("Moving Mouse" + "X Velocity: " + Input.mouseVelocity.x + "Y Velocity: " + Input.mouseVelocity.y);

    Input.update();
};

render();


render();
