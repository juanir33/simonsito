const round = document.getElementById('rounds');
const simonButtons = document.getElementsByClassName('square');
const startButton = document.getElementById('startButton');

class Simon{
    constructor(simonButtons, startButton, round){
        this.round = 0;
        this.userPosition = 0;
        this.totalRounds = 10;
        this.sequence = [];
        this.buttons = Array.from(simonButtons);
        this.speed = 1000;
        this.display = {
            startButton,
            round
        }
        this.errorSound = new Audio ('/sounds/error.mp3')
        this.buttonsSound = [
            new Audio ('/sounds/voice1.mp3'),
            new Audio ('/sounds/voice2.mp3'),
            new Audio ('/sounds/voice2.mp3'),
            new Audio ('/sounds/voice1.mp3'),

        ]
        this.blockedButtons = true;
        this.finalRound = new Audio ('/sounds/finish.mp3');
        this.winSound = new Audio ('/sounds/winwin.mp3');
        

    }
    //inicia el Simon
    init(){
        this.display.startButton.onclick = () => this.startGame();
    }
    //empieza el juego
    startGame(){
        this.display.startButton.disabled = true;
        this.updateRound(0);
        this.userPosition = 0;
        this.sequence = this.createSequence();
        this.buttons.forEach((element, i) => {
            element.classList.remove('winner');
            element.onclick = () => this.buttonClick(i);
        });
        
        
        this.showSequence();


        

    }
    //actualiza ronda 
    updateRound(value){
        this.round = value;
        this.display.round.textContent = `Round ${this.round}`;
    }
    //creamos la secuencia a mostrar
    createSequence(){
        return Array.from({length: this.totalRounds}, () => this.randomColor());
        
    };
    
    randomColor(){
        return Math.floor(Math.random() * 4);
    }
    //obtenemos ubicacion de boton para validar
    buttonClick(value){
        !this.blockedButtons && this.validateColor(value)
    }
    //validamos si el jugador presiono correctamente o no
    //si es correcta la validacion, tenemos dos opciones.
    //si es igual la ronda con la ubicacion del usuario,
    //a siguiente secuencia o fin del juego.
    //de lo contrario aumenta posicion jugador para una nueva validacion
    validateColor(value){
        if(this.sequence[this.userPosition] === value){    
            
            this.buttonsSound[value].play();
            if(this.round === this.userPosition){
                this.updateRound(this.round + 1);
                this.gameOver();
                this.speed / 1.02;

            }else{
                this.userPosition++;
            }
        }else{
            this.gameLost();   
        }

    }
    //aqui verificamos si se llego al final de las rondas totales o perdio antes.
    gameOver(){
        if(this.round === this.totalRounds){
            this.gameWon();
        }else{
            this.userPosition = 0;
            this.showSequence();
        }

    }
    final(){
        if(this.round === this.totalRounds - 1){
            this.finalRound.play();
        }
    }
    //funcion para mostrar la secuencia al usuario
    showSequence(){
        this.final();
        this.blockedButtons = true;
        let sequenceIndex = 0;
        let timer = setInterval(() =>{
            const button = this.buttons[this.sequence[sequenceIndex]];
            this.buttonsSound[this.sequence[sequenceIndex]].play();
            this.buttonStyle(button);
            setTimeout( () => this.buttonStyle(button), this.speed / 2);
            sequenceIndex++;
            if(sequenceIndex > this.round){
                 this.blockedButtons = false;
                 clearInterval(timer);
             }
             
        },this.speed);

    };
    buttonStyle(button){
        button.classList.toggle('active')
    }
    //actualiza el juego cuando el usuario pierde.
    gameLost(){        
        this.display.startButton.disabled = false;
        this.blockedButtons = true;
        this.errorSound.play();
    }
    //muestra animacion cuando se gana y actualiza para volver a empezar uno nuevo.
    gameWon(){
        this.display.startButton.disabled = false;
        this.updateRound('🏆');
        this.buttons.forEach(element => {
            element.classList.add('winner')
        });
        this.blockedButtons = true;

        this.winSound.play();
        
        
    }
}
console.log(this.sequence);
const simon = new Simon(simonButtons, startButton, round);
simon.init();
