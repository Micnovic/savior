//var rooms = [];
var rooms = {};
var roomsOrdered = [];
var buttons;
var gc;
var eventMachine;
var interpreterMessage;

//порядок добавления комнат в список roomsOrdered должен совпадать с порядком на сайте
window.onload = function() {
    buttons = document.getElementsByClassName("button");
    rooms.canteen = new Room();
    rooms.bridge = new Room();
    rooms.serverRoom = new Room();
    rooms.terminal = new Room();
    roomsOrdered.push(rooms.canteen);
    roomsOrdered.push(rooms.bridge);
    roomsOrdered.push(rooms.serverRoom);
    roomsOrdered.push(rooms.terminal);

    gc = new GameController();
    eventMachine = new EventMachine();
    interpreterMessage = document.getElementById("intepreter-message");
    gc.currentMission = Math.floor(Math.random() * missions.length);
    interpreterMessage.innerHTML += "Статус гибернации... разморозка завершена<br>Статус жизнеспособности экипажа... в норме<br> Статус жизнеспособности ковчега... в норме <br>Проверка систем корабля... в норме <br> Проверка входящих сообщений... Есть одно сообщение для экипажа: <br><br>";
    interpreterMessage.innerHTML += missions[gc.currentMission];
    interpreterMessage.innerHTML += "Пожалуйста, займите свои посты."
}

var missions = [];
missions[0] = "Доброе утро, экипаж. Вынужден разбудить вас, так как последняя разведка дронами доложила, что планета ZX3282, выбранная как текущий курс назначения, не удовлетворяет требованиям для колонизации. Через 115 лет ожидаются значительные сдвиги коры поверхности и вулканические извержения. Интерпретатор рекомендует экипажу надзора немедленно начать поиск другой подходящей планеты в Астрономическом центре, а затем совершить расчет маршрута в Навигационном центре. <br><br>";

class Room {
    constructor(){
        this.active = false;
    }
}

class GameController {
    constructor(){
        this.difficulty = 0;
        this.turnNumber = 0;
        this.currentMission;

        this.heat = 0;
        //this.coffee = 0;
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
                if (roomsOrdered[i].active == true){
                    difficulty++;
                }
            }
            gc.difficulty = difficulty;
            console.log("Difficulty has been set to " + difficulty)
        }
        //начальный этап
        this.message = "";

        //здесь идут события

        //накопление тепла
        if (d100()>95){
            gc.heat += 5;
        }
        if (gc.heat >= 15){
            if (rooms.terminal.active == false){
                this.message += "Перегрев системы охлаждения корабля. Произведите ручную отладку в Терминале охладителя <br><br>";
            }
        }


        //комнаты
        this.canteen();
        this.terminal();

        this.mission();

        //завершающий этап
        gc.turnNumber++;
        console.log("Turn " + gc.turnNumber);
        interpreterMessage.innerHTML = this.message;
    }
    canteen(){

    }

    mission(){
        //this.message += "mission <br><br>";
    }

    terminal()
    {
        if (rooms.terminal.active){
            gc.heat = Math.floor(gc.heat * 0.75);
            if (gc.heat >= 15) {
                this.message += "Производится отладка охладителя <br><br>";
            } else if (gc.heat >= 10){
                this.message += "Произведена отладка охладителя <br><br>";
            } else {
                this.message += "Произведена отладка охладителя. Системы в норме <br><br>";
            }
        }
    }
}

function d100(){
    return Math.floor(Math.random() * 100);
}

function buttonClick(i){
    if (buttons[i].className == "button")
    {
        buttons[i].className += " active";
        roomsOrdered[i].active = true;
    }
    else
    {
        buttons[i].className = "button";
        roomsOrdered[i].active = false;
    }
}

function turn() {
    eventMachine.turn();

    for (var i = 0; i < buttons.length; i++)
    {
        roomsOrdered[i].active = false;
        buttons[i].className = "button";
    }
}
