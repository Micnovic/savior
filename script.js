var canteen;
var bridge;
var serverRoom;

window.onload = function() {
    var interpreterMessage = document.getElementById("intepreter-message");
    var gameMessage = document.getElementById("game-message");

    var buttons = document.getElementsByClassName("button");
    for (var i = 0; i < buttons.length; i++)
    {
        buttons[i].addEventListener("click", function()
        {
            if (this.className == "button")
            {
                this.className += " active";
            }
            else
            {
                this.className = "button";
            }
        });
    }


    canteen = new Room("canteen");
    bridge = new Room("bridge");
    serverRoom = new Room("serverRoom");

    interpreterMessage.innerHTML = "Interpreter message";
}

//класс содержит всю информацию о комнате кроме информации об активности кнопки
class Room {
    constructor(name){
        this.name = name;
    }

}

function turn() {
    var buttons = document.getElementsByClassName("button");
    for (var i = 0; i < buttons.length; i++)
    {
        buttons[i].className = "button";
    }

    var interpreterMessage = document.getElementById("intepreter-message");
    var gameMessage = document.getElementById("game-message");
    interpreterMessage.innerHTML = "Wow";
}
