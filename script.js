//var rooms = [];
var rooms = {};
var buttons;
var gc;
var eventMachine;
var interpreterMessage;

//порядок добавления комнат в список должен совпадать с порядком на сайте
window.onload = function() {
    buttons = document.getElementsByClassName("button");
    // rooms.push(new Room("canteen"));
    // rooms.push(new Room("bridge"));
    // rooms.push(new Room("serverRoom"));
    // rooms.push(new Room("terminal"));
    rooms.canteen = new Room("canteen");
    rooms.bridge = new Room("bridge");
    rooms.serverRoom = new Room("serverRoom");
    rooms.terminal = new Room("terminal");

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
    constructor(name){
        this.name = name;
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
        this.mission();
        this.terminal();

        //завершающий этап
        gc.turnNumber++;
        console.log("Turn " + gc.turnNumber);
        interpreterMessage.innerHTML = this.message;
    }
    canteen(){
        if(rooms[0].active == true){
            // if(d100() > 50){
            //     this.message += "В столовой приготовлено кофе. <br><br>";
            //     gc.coffee++;
            // }
        }
    }

    mission(){
        //this.message += "mission <br><br>";
    }

    terminal()
    {
        if (isRoomActive("terminal")){
            console.log('wow');
            this.message += "В терминале есть человек";
        }
    }
}

function d100(){
    return Math.floor(Math.random() * 100);
}

function isRoomActive(roomName){
    var isActive = false;
    for (var i = 0; i < buttons.length; i++)
    {
        if(rooms[i].name == roomName && rooms[i].active == true)
        {
            isActive = true;
        }
    }
    return isActive;
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
    eventMachine.turn();

    for (var i = 0; i < buttons.length; i++)
    {
        rooms[i].active = false;
        buttons[i].className = "button";
    }
}
