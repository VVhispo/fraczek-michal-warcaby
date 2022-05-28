import {game, net} from './Main.js'

class Ui{
    constructor(){
        document.getElementById("btnLogin").onclick = net.loginAttempt;
        document.getElementById("btnReset").onclick = net.resetUsers;

        this.turnLog = document.getElementById('opponentMove')
        this.turnLogVisible = false
        this.log = document.getElementById("logs");
        this.errorDiv = document.getElementById("error");
        this.timer = 30
        this.endMessage = document.getElementById('gameEnded')
        this.endMessageSmall = document.getElementById('gameEndedMessage')
    }
    dataSuccess = () => {
        this.errorDiv.style.display = "none"
        document.getElementById("loginform").style.display = "none"
        document.getElementById("loginbg").style.display = "none"
        this.log.style.display = "flex"
    }
    dataFail = (data) => {
        this.errorDiv.innerText = "Error! " + data.error
        this.errorDiv.style.display = "block"
    }
    changeMoveInt = (turn) => {
        this.timer = 30
        clearInterval(this.interval)
        this.turnLogVisible = true
        this.turnLog.style.display = "flex";
        this.intervalExecute(turn)
        this.interval = setInterval(() => {this.intervalExecute(turn)}, 1000)
    }

    intervalExecute = (turn) => {
        if(turn == 'opponent'){
            this.turnLog.textContent = "Opponent's Turn! " + this.timer + " seconds left!"
            document.getElementById("loginbg").style.display = "block"

        }
        else if(turn == 'you'){
            this.turnLog.textContent = "Your turn! " + this.timer + " seconds left!"
            document.getElementById("loginbg").style.display = "none"
        }
        this.timer -= 1
        if(this.timer == 0) this.end(turn)
    }

    end = async (turn) =>{
        await new Promise(r => setTimeout(r, 1000));
        document.getElementById("loginbg").style.display = "block"
        document.getElementById("loginbg").style.zIndex = 1000
        clearInterval(this.interval)
        this.endMessage.style.display = 'flex'
        this.endMessageSmall.style.display = 'flex'
        window.onclick = () => {
            window.location.reload()
        }
        if(turn == 'opponent') {
            this.endMessage.style.textShadow = '2px 2px 4px #70ff69'
            this.endMessage.textContent = "You win!"
        }
        if(turn == 'you') {
            this.endMessage.style.textShadow = '2px 2px 4px #ff4040'
            this.endMessage.textContent = "You lose!"
        }
    } 
}
export default Ui