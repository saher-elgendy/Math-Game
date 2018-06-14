(() => {
    const model = {
        currentNumber1: 0,
        currentNumber2: 0,
        currentTime: 10000,
        currentScore: 0,
        result: 0,
        currentState: false
    }

    const controller = {
      init: function() {
          gameView.init();
          scoreView.init();
          timerView.init();
          this.gameSound();
      },
      // generating our numbers randomly
      getRandomNumber: function() {
         
        model.currentNumber1 = Math.floor(Math.random() * 20);
        model.currentNumber2 = Math.floor(Math.random() * 20);

        const randomResult = [this.getResult(), Math.floor(Math.random() * 40)]
        model.result = randomResult[Math.floor(Math.random() * randomResult.length)];
        
        return {
          currentNumber1: model.currentNumber1,
          currentNumber2: model.currentNumber2,
          result: model.result
        }    
      },

      decrementTimer: () => { 
           model.currentTime -= 50;
           return model.currentTime ;
      },
      
      getCurrentTime: () => model.currentTime, 
      
      getScore: () => model.currentScore,

      incrementScore: function() {
         if(model.currentState) model.currentScore += 1;

         this.changeQuiz();

         return this.getScore();
      },
        
      getResult: () => {
        return model.currentNumber1 + model.currentNumber2;
      },

      checkTrue: function() {
         return (this.getResult() === model.result);
      },
      // 
      setState: (e) => {
        const target = e.target;

        model.currentState = (target === gameView.correctButton && controller.checkTrue()) || 
                              (target === gameView.wrongButton && !controller.checkTrue())

        // increment the rest of time
        if(model.currentState)  model.currentTime += 10000;    
        //check if the game should end with the current states               
        controller.checkGameEnd();    
      },

      changeQuiz: () => {
         gameView.render();
      },  

      checkWin: () => {
        //15 correct answers means the player wins
        if(model.currentScore === 15) {
          clearInterval(timerView.id)
          alert('You Win');
          location.href= 'index.html'; 
        };
      }, 

      gameOver: () => {
        clearInterval(timerView.id);
        alert('Game Over');
        location.href= 'index.html'; 
      },

      checkGameEnd: function() {
        if(!model.currentState) {
           this.gameOver();
        } 

        else {
          scoreView.render(); 
          setTimeout(() => controller.checkWin(), 100);
        }
      },
      // our game sound
      gameSound: () => {
        this.mainMusic = new Audio('game.wav');
        this.mainMusic.volume = 0.2;
        this.mainMusic.play();    
      }
    }
    // Numbers view
    const gameView = {
        init: function() {
           // get our components
           this.firstNumCont = document.getElementById('number1'); 
           this.secondNumCont = document.getElementById('number2');
           this.resultCont = document.getElementById('result');

           this.correctButton = document.getElementById('correct-btn');
           this.wrongButton = document.getElementById('wrong-btn');
          
           // adding click events to the buttons
           this.correctButton.addEventListener('click', controller.setState);
           this.wrongButton.addEventListener('click', controller.setState); 
           // render our game numbers
           this.render();
             
        }, 
        // set the random numbers 
        render: function() {
           const randomNumbers = controller.getRandomNumber();
           this.firstNumCont.innerHTML = randomNumbers.currentNumber1;
           this.secondNumCont.innerHTML = randomNumbers.currentNumber2;
           this.resultCont.innerHTML = randomNumbers.result;
        }   
   }
   // score view
   const scoreView = {
     init: function() {
       this.scoreCont = document.getElementById('score');
       //update score  when the answer is correct   
       this.render();
     },
    // 
     render: function() {
         this.scoreCont.innerHTML = controller.incrementScore();
     }
   }  
   // timer view
   const timerView = {
     init: function() {
        this.timerCont = document.querySelector('#timing'); 
        this.render();
     },

     render:function() {
       
       this.id = setInterval(() => {
         this.timerCont.innerHTML = controller.decrementTimer();
         // decrement time and check time end, if the time end, the game end
         if(controller.getCurrentTime() === 0 && controller.getScore() < 15) { 
             clearInterval(this.id);
             setTimeout(() => controller.gameOver(), 100);
         }
       } , 50);
     
     }
   }  
   // initialize our controller
   controller.init();
})();
