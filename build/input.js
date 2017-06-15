var Input =
{
    isMobile : false,

    clientPosition : {
        x:0,
        y:0
    },

    clientX : 0,
    clientY : 0,

    keys : {},
    keysDown : {},
    keysUp : {},

    hasPressedKey : false,
    hasPressedKeyDown : false,
    hasPressedKeyUp : false,

    currentPressedKey : null,
    currentPressedKeyDown : null,
    currentPressedKeyUp : null,

    mouseButtons : {left: 0, middle: 1, right: 2},
    buttons :  {},
    buttonsDown : {},
    buttonsUp : {},

    //Argument object variables
    alwaysTrackMovement :  false,
    removeContextMenu : true,
    listenForKeyboard : true,
    listenForMouse : true,
    eventMode : false,

    mouseVelocity : {
        x:0,
        y:0
    },
    lastPosition : {
        x:0,
        y:0
    },
    
    hasMoved : false,
    hasHeld : false,
    heldTimeout : null,

    _events : {},

    lastDirection : null,
}
Input.initialize = function(parameters)
{
    if( navigator.userAgent.match(/Android/i)
        || navigator.userAgent.match(/webOS/i)
        || navigator.userAgent.match(/iPhone/i)
        || navigator.userAgent.match(/iPad/i)
        || navigator.userAgent.match(/iPod/i)
        || navigator.userAgent.match(/BlackBerry/i)
        || navigator.userAgent.match(/Windows Phone/i)
        )
        this.isMobile = true;
    else 
        this.isMobile = false;

    this.setParameters(parameters)

    if(this.listenForMouse)
    {
        if(this.isMobile)
        {
            this.eventMode = true;
            this.setTouch();
        }
        else 
            this.setMouse();
    }

    if(this.listenForKeyboard && !this.isMobile)
        this.setKeys();
}
Input.setParameters = function(parameters)
{
    if(parameters == undefined)
        return;

    for(var key in parameters)
    {
        if(parameters[key] != undefined)
            this[key] = parameters[key];
    }
}
Input.setMouse = function()
{
    var self = this;

    this.onClick = function(e){
        e.preventDefault();
        window.addEventListener('mouseup', self.onMouseUp, false)

        if(!this.alwaysTrackMovement)
            window.addEventListener('mousemove', self.onMouseMove, false)
        
        var event = e;

        self.heldTimeout = setTimeout(function(){
            self.hasHeld = true;
            self.heldTimeout = null;

            if(self.eventMode)
            {
                self.emit("held", e);
                self.checkButton(e, "leftHeld", "middleHeld", "rightHeld");
            }
        }, 500, self)

        self.clientPosition.x = e.clientX;
        self.clientPosition.y = e.clientY;

        self.mouseDown = e.button;

        if(self.eventMode)
        {
            self.emit('mouseDown', e);
            self.checkButton(e, "leftClick", "middleClick", "rightClick");
        }
        else{
            self.buttons[e.button] = true;
            self.buttonsDown[e.button] = true;
        }
        
    }
    this.onMouseMove = function(e){
        self.clientX = e.clientX;
        self.clientY = e.clientY;

        if(self.clientPosition.x == e.clientX && self.clientPosition.y == e.clientY)
            return;
            
        self.clientPosition.x = e.clientX;
        self.clientPosition.y = e.clientY;

        if(self.heldTimeout != null)
        {
            clearTimeout(self.heldTimeout)
            self.heldTimeout = null;
        }
        self.updateVelocity(e);

        if(self.eventMode)
            self.emit("mouseMove", e);

        self.checkButton(e, "leftMove", "middleMove", "rightMove");
    }
    this.onDoubleClick = function(e){
        e.preventDefault();
        if(self.heldTimeout != null)
        {
            clearTimeout(self.heldTimeout)
            self.heldTimeout = null;
        }

        if(self.eventMode)
            self.emit("doubleClick", e);
    }
    this.onMouseUp = function(e){
        
        if(self.heldTimeout != null)
        {
            clearTimeout(self.heldTimeout)
            self.heldTimeout = null;
        }

        if(self.eventMode)
            self.emit("mouseUp", e);
        else{
            self.buttons[e.button] = false;
            self.buttonsUp[e.button] = true;
        }

        self.checkButton(e, "leftMouseUp", "middleMouseUp", "rightMouseUp");

        window.removeEventListener('mouseup', self.onMouseUp, false)

        if(!this.alwaysTrackMovement)
            window.removeEventListener('mousemove', self.onMouseMove, false)
    }

    this.onMouseWheel = function(e)
    {
        if(self.eventMode)
            self.emit("mouseWheel", e);
    }

    window.addEventListener('mousedown', this.onClick, false)
    window.addEventListener('dblclick', this.onDoubleClick, false)

    if(this.alwaysTrackMovement)
        window.addEventListener('mousemove', self.onMouseMove, false);

    window.addEventListener('contextmenu', function(e){e.preventDefault()}, false)
    window.addEventListener('mousewheel', this.onMouseWheel, false);
}
Input.setTouch = function()
{
    var self = this;
    
    this.onTouch = function(e){

        self.emit("touch", e);

        self.touches = e.touches.length;
        self.hasPressed = true;
        window.addEventListener('touchend', self.onTouchEnd, false)
        window.addEventListener('touchmove', self.onTouchMove, {passive:false})
        
        var time = e.timeStamp - self.lastTimeStamp
        if(time < 150)
            self.emit("doubleClick", e);
            
        self.lastTimeStamp = e.timeStamp;

        var event = e;

        self.holdTimeout = setTimeout(function(){
            if(self.hasPressed)
                self.emit("touchHeld", e);
            self.holdTimeout = null;
        }, 500, self)
    }
    this.onTouchMove = function(e){
        if(self.holdTimeout != null)
        {
            clearTimeout(self.holdTimeout)
            self.holdTimeout = null;
        }
        self.clientX = e.touches[0].clientX;
        self.clientY = e.touches[0].clientY;
        e.preventDefault();

        self.emit("touchMove", e);
    }
    this.onDoubleClick = function(e){e.preventDefault(); self.doubleClick(e)}
    this.onTouchEnd = function(e){
        self.hasPressed = false;
        window.removeEventListener('touchend', self.touchEnd, false)
        window.removeEventListener('touchmove', self.touchMove, false)

        if(self.holdTimeout != null)
        {
            clearTimeout(self.holdTimeout)
            self.holdTimeout = null;
        }

        self.emit("touchEnd", e);
    }

    window.addEventListener('touchstart', this.onTouch, false)
    window.addEventListener('dblclick', this.onDoubleClick, false)
}
Input.setKeys = function()
{
    var self = this;

    /*this.keyCodes = {
        8 : "backspace", 9 : "tab", 13 : "enter", 16 : "shift",
        17 : "ctrl", 18 : "alt", 19 : "pause", 20 : "caps",
        27 : "escape", 32: "space", 33 : "pageup", 34 : "pagedown", 35 : "end",
        36 : "home", 37 : "left", 38 : "up", 39 : "right",
        40 : "down", 45 : "insert", 46 : "delete", 48 : "0",
        49 : "1", 50 : "2", 51 : "3", 52 : "4",
        53 : "5", 54 : "6", 55 : "7", 56 : "8",
        57 : "9", 65 : "a", 66 : "b", 67 : "c",
        68 : "d", 69 : "e", 70 : "f", 71 : "g",
        72 : "h", 73 : "i", 74 : "j", 75 : "k",
        76 : "l", 77 : "m", 78 : "n", 79 : "o",
        80 : "p", 81 : "q", 82 : "r", 83 : "s",
        84 : "t", 85 : "u", 86 : "v", 87 : "w",
        88 : "x", 89 : "y", 90 : "z", 91 : "lwindowskey",
        92 : "rwindowskey", 93 : "select", 96 : "numpad0", 97 : "numpad1",
        98 : "numpad2", 99 : "numpad3", 100 : "numpad4", 101 : "numpad5",
        102 : "numpad6", 103 : "numpad7", 104 : "numpad8", 105 : "numpad9",
        106 : "multiply", 107 : "add", 109 : "subtract", 110 : "decimalpoint",
        111 : "divide", 112 : "f1", 113 : "f2", 114 : "f3",
        115 : "f4", 116 : "f5", 117 : "f6", 118 : "f7",
        119 : "f8", 120 : "f9", 121 : "f10", 122 : "f11",
        123 : "f12", 144 : "numlock", 145 : "scrolllock", 186 : "semicolon",
        187 : "equals", 188 : "comma", 189 : "dash", 190 : "period",
        191 : "forwardslash", 192 : "graveaccent", 219 : "openbracket", 220 : "backslash",
        221 : "closebracket", 222 : "singlequote"   
    }*/

    this.onKeyDown = function(e)
    {
        var key = e.key;
        if(key == "Tab" || key == "Alt")
            e.preventDefault();
        else if(key == " ")
            key = "space";

        if(self.eventMode)
            self.emit("keydown", key.toLowerCase());
        else
            self.keyDown(key.toLowerCase());
    }

    this.onKeyUp = function(e)
    {
        var key = e.key;

        if(key == " ")
            key = "space";

        if(self.eventMode)
            self.emit("keyup", key.toLowerCase());
        else
            self.keyUp(key.toLowerCase());
    }

    window.addEventListener('keydown', this.onKeyDown, false)
    window.addEventListener('keyup', this.onKeyUp, false);
}
Input.getMouse = function(mouseButton)
{
    var button = this.mouseButtons[mouseButton.toLowerCase()];
    return this.buttons[button];
}
Input.getMouseDown = function(mouseButton)
{
    var button = this.mouseButtons[mouseButton.toLowerCase()];

    if(this.buttonsDown[button])
        return true;
    else
        return false;
}
Input.getMouseUp = function(mouseButton)
{
    var button = this.mouseButtons[mouseButton.toLowerCase()];

    if(this.buttonsUp[button])
        return true;
    else
        return false;
}
Input.keyDown = function(key)
{
    if(!this.keys[key] && this.currentPressedKey != key)
    {
        this.hasPressedKey = true;
        this.hasPressedKeyDown = true;
        
        this.keys[key] = true;
        this.keysDown[key] = true;

        this.currentPressedKey = key;
        this.currentPressedKeyDown = key;
    }
}
Input.keyUp = function(key)
{
    if(this.keys[key])
    {
        this.hasPressedKey = false;
        this.hasPressedKeyUp = true;
        
        this.keys[key] = false;
        this.keysUp[key] = true;

        this.currentPressedKey = null;
        this.currentPressedKeyUp = key;
    }
}
Input.getKey = function(key)
{
    if(this.keys[key.toLowerCase()])
        return true;
    else
        return false;
}
Input.getKeyDown = function(key)
{
    if(this.keysDown[key.toLowerCase()])
        return true;
    else
        return false;
}
Input.getKeyUp = function(key)
{
    if(this.keysUp[key.toLowerCase()])
        return true;
    else
        return false;
}
/*Input.charFromKeyCode = function(keyCode)
{
    return this.keyCodes[keyCode];
}*/
Input.checkButton = function(e, leftEmitter, middleEmitter, rightEmitter)
{
    if(e.button == Input.MOUSE.LEFT)
        this.emit(leftEmitter, e);
    else if(e.button == Input.MOUSE.MIDDLE)
        this.emit(middleEmitter, e);
    else if(e.button == Input.MOUSE.RIGHT)
        this.emit(rightEmitter, e);
}
Input.updateVelocity = function(e)
{
    this.mouseVelocity.x = this.clientPosition.x - this.lastPosition.x;
    this.mouseVelocity.y = this.clientPosition.y - this.lastPosition.y;

    this.lastPosition.x = this.clientPosition.x;
    this.lastPosition.y = this.clientPosition.y;

}
Input.update = function()
{
    for(var key in this.buttonsDown)
    {
        this.buttonsDown[key] = false;
    }

    for(var key in this.buttonsUp)
    {
        this.buttonsUp[key] = false
    }

    for(var key in this.keysDown)
    {
        this.keysDown[key] = false;
    }

    for(var key in this.keysUp)
    {
        this.keysUp[key] = false;
    }
    
    this.hasPressedKeyDown = false;
    this.hasPressedKeyUp = false;
    
    this.currentPressedKeyDown = null;
    this.currentPressedKeyUp = null;

    this.mouseVelocity.x = 0;
    this.mouseVelocity.y = 0;
}
Input.on = function(listener, listenerFunction)
{
    this._events[listener] = listenerFunction;
}
Input.emit = function(listener, data)
{
    if(this._events[listener])
        this._events[listener].call(this, data);
}
Input.MOUSE = {
    LEFT: 0,
    MIDDLE: 1,
    RIGHT: 2
}


/**
 * 
 * 'leftClick'
 * 'middleClick'
 * 'rightClick'
 * 
 * 'mouseUp'
 * 'leftMouseUp'
 * 'middleMouseUp'
 * 'rightMouseUp'
 * 
 * 'held'
 * 'leftHeld'
 * 'middleHeld'
 * 'rightHeld'
 * 
 * 'mouseMove'
 * 'leftMove'
 * 'middleMove'
 * 'rightMove'
 * 'touch'
 * 'touchMove'
 * 'touchEnd'
 * 'doubleClick'
 * 
 */