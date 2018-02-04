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
    rooms.pilot = new Room();
    rooms.astroCenter = new Room();
    rooms.navCenter = new Room();
    roomsOrdered.push(rooms.canteen);
    roomsOrdered.push(rooms.bridge);
    roomsOrdered.push(rooms.serverRoom);
    roomsOrdered.push(rooms.terminal);
    roomsOrdered.push(rooms.pilot);
    roomsOrdered.push(rooms.astroCenter);
    roomsOrdered.push(rooms.navCenter);

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
        this.course = false;
        this.distanceToPlanet = 20;

        this.astroData = 0;
        this.planetFound = false;
        this.courseProgress = 0;
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
            for (var i = 0; i < roomsOrdered.length; i++)
            {
                if (roomsOrdered[i].active == true){
                    difficulty++;
                }
            }
            gc.difficulty = difficulty;
            console.log("Difficulty has been set to " + difficulty)

            //change parameters according to Difficulty
            gc.distanceToPlanet += gc.difficulty;
        }

        //начальный этап
        this.message = "";

        //здесь идут события

        //накопление тепла
        if (d100()>=95){
            gc.heat += 2+gc.difficulty;
        }
        if (gc.heat >= 15){
            if (rooms.terminal.active == false){
                this.message += "Перегрев системы охлаждения корабля. Произведите ручную отладку в Терминале охладителя <br><br>";
            }
        }


        //комнаты
        this.canteen();
        this.terminal();
        this.astroCenter();
        this.navCenter();
        this.pilot();

        this.mission();

        //завершающий этап
        gc.turnNumber++;
        console.log("Turn " + gc.turnNumber);
        interpreterMessage.innerHTML = this.message;
    }

    canteen(){
        if (rooms.canteen.active && d100() >= 40+gc.difficulty*2){
            this.message += "В столовой приготовлено кофе. Моральный дух всех членов экипажа повышен<br><br>";
            gc.heat++;
        }
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

    pilot()
    {
        if (rooms.pilot.active && gc.course == true){
            gc.distanceToPlanet--;
            this.message += "Корабль пилотируется в сторону планеты <br><br>";
            gc.heat++;
        }
        else if (rooms.pilot.active && gc.course == false){
            this.message += "Вы не можете пилотировать корабль, потому что курс не проложен <br><br>";
        }
    }

    astroCenter(){
        if(rooms.astroCenter.active && d100()>=95 && gc.currentMission == 0){
            this.message += "Производен сбор навигационных данных с помощью дронов. Обнаружена планета. Вы можете проложить курс <br><br>";
            gc.planetFound = true;
            gc.astroData+=5;
        }
        else if(rooms.astroCenter.active && d100()>=65){
            var anomalies = ["газовое облако", "скопление астероидов", "реликтовое излучение"];
            this.message += "Производен сбор навигационных данных с помощью дронов. Обнаружено " + anomalies[Math.floor(Math.random() * anomalies.length)] + " <br><br>";
            gc.astroData++;
        }
        else if (rooms.astroCenter.active){
            this.message += "Производится сбор навигационных данных с помощью дронов. Новой информации не обнаружено <br><br>";
        }
    }

    navCenter(){
        if(rooms.navCenter.active && gc.planetFound == true && gc.courseProgress >= 5){
            this.message += "Курс к планете проложен <br><br>";
            gc.course = true;
        }
        else if (rooms.navCenter.active && gc.planetFound == true){
            this.message += "Прокладывается курс к планете <br><br>";
            if(d100() >= 50 + gc.difficulty*1.5){
                gc.courseProgress++;
            }
        }

        if (rooms.navCenter.active && gc.astroData > 0 && d100()+gc.astroData*2 > 50 + gc.difficulty*2){
            this.message += "Благодаря полученной информации, глобальная база знаний пополена <br><br>";
            gc.astroData--;
        }
        else if (rooms.navCenter.active && gc.astroData > 0){
            this.message += "Производится пополнение глобальной базы знаний <br><br>";
        }
        else if (rooms.navCenter.active){
            this.message += "В навигационном центре недостатчно информации, чтобы заняться разработкой <br><br>";
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
