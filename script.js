var rooms = [];
var buttons = document.getElementsByClassName("button");
var gc;
var eventMachine;
var interpreterMessage;

//порядок добавления комнат в список должен совпадать с порядком на сайте
window.onload = function() {
    rooms.push(new Room("canteen"));
    rooms.push(new Room("bridge"));
    rooms.push(new Room("serverRoom"));
    gc = new GameController();
    eventMachine = new EventMachine();
    interpreterMessage = document.getElementById("intepreter-message");
    var currentMission = Math.floor(Math.random() * missions.length);
    interpreterMessage.innerHTML += "Статус гибернации... разморозка завершена<br>Статус жизнеспособности экипажа... в норме<br> Статус жизнеспособности ковчега... в норме <br>Проверка систем корабля... в норме <br> Проверка входящих сообщений... Есть одно сообщение для экипажа: <br><br>";
    interpreterMessage.innerHTML += missions[currentMission];
    interpreterMessage.innerHTML += "Пожалуйста, займите свои посты."
}

var missions = [];
missions[0] = "Доброе утро, экипаж. Вынужден разбудить вас, так как последняя разведка дронами доложила, что планета ZX3282, выбранная как текущий курс назначения, не удовлетворяет требованиям для колонизации. Через 115 лет ожидаются значительные сдвиги коры поверхности и вулканические извержения. Интерпретатор рекомендует экипажу надзора немедленно начать поиск другой подходящей планеты в Астрономическом центре, а затем совершить расчет маршрута в Навигационном центре. <br><br>";

class Room {
    constructor(name){
        this.name = name;
        this.active = false;
    }
}

class GameController {
    constructor(){
        this.difficulty = 0;
        this.turnNumber = 0;

        this.coffee = 0;
    }
}

class EventMachine {
    constructor(){
        this.message = "";
    }

    turn() {
        //setting difficulty on a first turn
        if(gc.turnNumber == 0){
            var difficulty = 0;
            for (var i = 0; i < rooms.length; i++)
            {
                if (rooms[i].active == true){
                    difficulty++;
                }
            }
            gc.difficulty = difficulty;
            console.log("Difficulty has been set to " + difficulty)
        }
        //начальный этап
        this.message = "";

        //здесь идут события
        this.canteen();
        this.alert();
        this.mission();

        //завершающий этап
        gc.turnNumber++;
        console.log("Turn " + gc.turnNumber);
        interpreterMessage.innerHTML = this.message;
    }
    canteen(){
        if(rooms[0].active){
            if(d100() > 20){
                this.message += "В столовой приготовлено кофе. <br><br>";
                gc.coffee++;
            }
        }
    }

    alert(){
        this.message += "alert <br><br>";
    }

    mission(){
        this.message += "mission <br><br>";
    }
}

function d100(){
    return Math.floor(Math.random() * 100);
}

function buttonClick(i){
    if (buttons[i].className == "button")
    {
        buttons[i].className += " active";
        rooms[i].active = true;
    }
    else
    {
        buttons[i].className = "button";
        rooms[i].active = false;
    }
}

function turn() {
    for (var i = 0; i < buttons.length; i++)
    {
        buttons[i].className = "button";
    }

    eventMachine.turn();
}
