let Plansza = document.querySelector('#Plansza');
let clock = document.querySelector('#timer'); 
let scoreTable = document.querySelector('#scoreTable');
let c = Plansza.getContext('2d')
Plansza.width = 1000 
Plansza.height = 1000

let gameDisplayX = Plansza.width;
let gameDisplayY = Plansza.height;
let randomX = Math.random() * (gameDisplayX - 30) // x dla polozenia dziury
let randomY = Math.random() * (gameDisplayY - 30) // y dla polozenia dziury
let lifesAmount;      
let score;         
let ball;                 
let clockTimer;         
    

let devicePosition = {
    beta: undefined, //beta ma zakres od -180 do 180 stopni i jest w pionie
    gamma: undefined //gamma ma zakres od -90 do 90 stopni i jest w poziomie
}
window.addEventListener('deviceorientation', (e) => {
    devicePosition.beta = e.beta;
    devicePosition.gamma = e.gamma;
    if(devicePosition.beta > 90){
        devicePosition.beta = 90;
    }
    if(devicePosition.beta < -90){
        devicePosition.beta = -90;
    }
})

function Ball(x, y){
    this.x = x;
    this.y = x;
    this.resetPosition = function(){
        this.x = x; 
        this.y = y;
    }
//rysowanie piłki
    this.drawBall = function(){
        c.beginPath();
        c.arc(this.x, this.y, 10, 0, Math.PI * 2, false);
        c.fillStyle = "#D53232"
        c.fill();
        c.closePath()
    }
    this.update = function(){        
        if(devicePosition.beta  && devicePosition.gamma){
            this.y += devicePosition.beta / 40;  
            this.x += devicePosition.gamma / 40;
        }
    //funkcja sprawdzająca czy kulka mieści się w canvasie
    this.checkWallCollision = function(){
        let flag = true;
        if((this.y + 5 < gameDisplayY) && (this.y - 5 > 0) && (this.x + 5 < gameDisplayX) && (this.x - 5 > 0)){
            return false;
        }
        return flag;
    }
    this.checkHoleCollision = function(){
        let flag = false; 
        if((this.y < randomY + 30) && (this.y > randomY) && (this.x > randomX)  && (this.x < randomX + 30))
        {
            flag = true;
        }
        return flag;
    }
        //jeśli zajdzie kolizja, to kulka wypada za mape (koniec gry strata punktu zycia) 
        if(this.checkWallCollision()){
            this.resetPosition();
            lifesAmount--;
            scoreTable.innerHTML = "Score: " + score + " Lifes: " + lifesAmount; //wyswietlanie ilosci żyć i punktów na ekranie       
            newLife(); 
        }
        if(this.checkHoleCollision()){
            this.resetPosition();
            score++;//jeśli trafiono do dziury, to liczba punktów rośnie o 1
            scoreTable.innerHTML = "Score: " + score + " Lifes: " + lifesAmount; //wyswietlanie ilosci żyć i punktów na ekranie
            newLife(); 
        }
        this.drawBall();
       
    }
}

function moveBall(){
    requestAnimationFrame(moveBall); //zapętli się animacja
    c.clearRect(0, 0, gameDisplayX, gameDisplayY); //czyszczenie canvasa
    ball.update();
    spawnHole();
}
//funkcja losująca nowe współrzędne dla dziur, wykorzystywana po każdej stracie życia lub zdobyciu punktu
function getRandomCoordsForHoles(){
    randomX = Math.random() * (gameDisplayX - 30) // x dla polozenia dziury
    randomY = Math.random() * (gameDisplayY - 30) // y dla polozenia dziury
}

function spawnHole(){
    //rysowanie dziury
    c.beginPath();
    c.rect(randomX, randomY, 30, 30)
    c.fillStyle = "blue"
    c.fill();
    c.closePath()
}

function startGame(){   
    ball = new Ball(gameDisplayX/2, gameDisplayY/2); //nowy obiekt piłki, pojawia się na środku canvasa
    lifesAmount = 3; //startowa ilość żyć
    score = 0; //początkowy wynik
    scoreTable.innerHTML = "Score: " + score + " Lifes: " + lifesAmount; //wyswietlanie ilosci żyć na ekranie
    moveBall();
    newLife();
    gameStatusTimer = setInterval(() =>{
        //jeśli liczba żyć spadnie do 0, to wywoła się funkcja gameOver()
        if(lifesAmount == 0){
            gameOver();         
        }
        }, 100) 
}
function newLife(){   
    getRandomCoordsForHoles(); //losuje nowe położenie dziury  
}

function gameOver(){
    alert("Game over! Your score was: " + score + '\n' + "If you click ok, the game will start again.");
    clearInterval(gameStatusTimer);
    startGame(); 

}
