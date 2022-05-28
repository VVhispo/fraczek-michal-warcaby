import {game, ui} from './Main.js'
 
class Net {
    constructor() {
        this.username = ""
    }

    resetUsers = () => {
        fetch("/resetUsers", { method: "post" })
        ui.errorDiv.style.display = "none"
    }

    loginAttempt = () => {
        this.username = document.getElementsByName("username")[0].value;
        let data = { username: this.username }
        const body = JSON.stringify(data)
        const headers = { "Content-Type": "application/json" };
        fetch("/loginUser", { method: "post", body, headers })
            .then(response => response.json())
            .then((data) => { this.handleLoginResponse(data) })
    }

    handleLoginResponse = (data) => {
        if (data.success) {
            ui.dataSuccess()
            game.pieces()
            if (data.userid == 2) game.secondUserCamera()
            this.getPlayersStatus()
            setInterval(this.getPlayersStatus, 500)

        } else {
            ui.dataFail(data)
        }
    }

    getPlayersStatus = () => {
        fetch("/getPlayers", { method: "post" })
            .then(response => response.json())
            .then((data) => { this.handleLogs(data) })
    }

    handleLogs = (data) => {
        if (data.users.length == 1) {
            ui.log.textContent = "Waiting for another player"
            game.waiting = true
        }
        else if (data.users.length == 2) {
            game.waiting = false
            ui.log.textContent = "Playing against " + data.users.filter(item => { return item != this.username })
            console.log(ui.turnLog.style.display)
            if(!ui.turnLogVisible) ui.changeMoveInt(game.move)
        }
    }

    checkForMoves = () => {
        if (game.waiting) return
        let body = JSON.stringify({ user: game.side })
        const headers = { "Content-Type": "application/json" };
        fetch('/getMoves', { method: 'post', body, headers })
            .then(response => response.json())
            .then(data => { game.manageOppMove(data) })
    }
}

export default Net