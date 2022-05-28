import Pawn from './Pawn.js';
import Field from './Item.js'
import Materials from './Materials.js';
import {ui, net} from "./Main.js"

class Game {
    constructor() {
        window.onresize = this.resizeEvent
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setClearColor(0x7a7a7a);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.camera.position.set(0, 60, 80)
        this.camera.lookAt(this.scene.position)
        this.BoardPieceGeometry = new THREE.BoxGeometry(10, 5, 10);
        this.PieceGeometry = new THREE.CylinderGeometry(5, 5, 2, 20);
        this.raycaster = new THREE.Raycaster();
        this.mouseVector = new THREE.Vector2();
        window.addEventListener("mousedown", (e) => {
            this.raycasterEvent(e)
        });

        let materials = new Materials()
        this.BoardPieceMaterialLight = materials.BoardPieceMaterialLight
        this.BoardPieceMaterialDark = materials.BoardPieceMaterialDark
        this.BoardPieceMaterialGlow = materials.BoardPieceMaterialGlow
        this.PieceMaterialDark = materials.PieceMaterialDark
        this.PieceMaterialLight = materials.PieceMaterialLight 
        this.PieceMaterialLightMarked = materials.PieceMaterialLightMarked
        this.PieceMaterialDarkMarked = materials.PieceMaterialDarkMarked

        document.getElementById("root").append(this.renderer.domElement);
        this.pawns = []
        this.fields = []
        this.markedPawn = null;
        this.side = 'white'
        this.waiting = true
        this.move = 'you'
        this.markedFields = []
        this.logstext = document.getElementById("logs").value

        this.szachownica = [
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
        ];

        this.pionki = [
            [0, 2, 0, 2, 0, 2, 0, 2],
            [2, 0, 2, 0, 2, 0, 2, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],

        ];
        this.chessboard() //wygenerowanie chessboardu
        this.render() // wywołanie metody render
        setInterval(() => {net.checkForMoves()}, 300);
    }
    secondUserCamera = () => {
        this.camera.position.z = -80
        this.camera.lookAt(this.scene.position)
        this.side = 'black'
        this.move = 'opponent'
    }
    resizeEvent = () => {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    chessboard = () => {
        //board
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                let piece = (this.szachownica[i][j] == 0) ? new Field(this.BoardPieceGeometry, this.BoardPieceMaterialDark, 'blackfield', i, j) : new Field(this.BoardPieceGeometry, this.BoardPieceMaterialLight, 'whitefield', i, j)
                piece.position.set(-35 + i * 10, 0, -35 + j * 10)
                this.fields.push(piece)
                this.scene.add(piece)
            }
        }
    }
    pieces = () => {
        //pieces
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (this.pionki[i][j] != 0) {
                    let piece = (this.pionki[i][j] == 2) ? new Pawn(this.PieceGeometry, this.PieceMaterialDark, 'blackpawn', j, i) : new Pawn(this.PieceGeometry, this.PieceMaterialLight, 'whitepawn', j, i);
                    piece.position.set(-35 + j * 10, 4, -35 + i * 10)
                    this.pawns.push(piece)
                    this.scene.add(piece)
                }

            }
        }
    }
    raycasterEvent = (e) => {
        this.pawns.forEach(item =>{
            if(item.name.includes('white')) item.changeMaterial(this.PieceMaterialLight)
            else item.changeMaterial(this.PieceMaterialDark)
        })
        this.mouseVector.x = (e.clientX / window.innerWidth) * 2 - 1;
        this.mouseVector.y = -(e.clientY / window.innerHeight) * 2 + 1;
        this.raycaster.setFromCamera(this.mouseVector, this.camera);
        const intersects = this.raycaster.intersectObjects(this.scene.children);
        if (this.waiting == true || intersects.length < 1 || this.move == 'opponent') return
        if (intersects[0].object.name.includes('pawn') && intersects[0].object.name.includes(this.side)) {
            this.fields.forEach(item => {
                if (item.name == 'blackfield') item.changeMaterial(this.BoardPieceMaterialDark)
            });
            this.markedPawn = this.pawns.find(item => item == intersects[0].object)
            if(this.side == 'white') this.markedPawn.changeMaterial(this.PieceMaterialLightMarked) 
            else this.markedPawn.changeMaterial(this.PieceMaterialDarkMarked)
            this.markedFields = this.fields.filter(item => {
                if (this.side == 'white') return item.name == 'blackfield' && Math.abs(item.x - this.markedPawn.x) <= 1 && item.y + 1 == this.markedPawn.y && !this.pawns.some(element => { return item.x == element.x && item.y == element.y && element.name.includes('white') })
                else return item.name == 'blackfield' && Math.abs(item.x - this.markedPawn.x) <= 1 && item.y - 1 == this.markedPawn.y && !this.pawns.some(element => { return item.x == element.x && item.y == element.y && element.name.includes('black') })
            })
            let fieldbelowenemy = []
            this.pawns.forEach(item => {
                for (let i in this.markedFields) {
                    if (this.markedFields[i].x == item.x && this.markedFields[i].y == item.y) fieldbelowenemy.push(this.markedFields[i])
                }
            })
            // console.log(fieldbelowenemy)
            // console.log(this.markedFields)
            fieldbelowenemy.forEach(item => {
                this.markedFields.push(
                    this.fields.find(field => {
                        return field.x == item.x + (item.x - this.markedPawn.x) && field.y == item.y + (item.y - this.markedPawn.y)
                    })
                )
            })
            this.markedFields = this.markedFields.filter(item => {
                return !fieldbelowenemy.includes(item) && item != undefined && item != null && !this.pawns.some(element => item.x == element.x && item.y == element.y)
            })
            this.markedFields.forEach(item => {
                item.changeMaterial(this.BoardPieceMaterialGlow)
            });
        }
        else if (this.markedFields.some(item => item == intersects[0].object)
            && this.markedPawn != null) {
            //

            this.pionki[this.markedPawn.y][this.markedPawn.x] = 0
            this.pionki[intersects[0].object.y][intersects[0].object.x] = (this.markedPawn.name.includes('black')) ? 2 : 1

            if (Math.abs(this.markedPawn.y - intersects[0].object.y) > 1) { //ZBICIE A NIE NORMALNY RUCH
                let tempX = (this.markedPawn.x - intersects[0].object.x) / 2
                let tempY = (this.markedPawn.y - intersects[0].object.y) / 2

                this.pionki[this.markedPawn.y - tempY][this.markedPawn.x - tempX] = 0
                let donePawn = this.pawns.find(item => {
                    return item.x == this.markedPawn.x - tempX && item.y == this.markedPawn.y - tempY
                })
                let body = JSON.stringify({ pawnToMove: donePawn.position, user: this.side })
                const headers = { "Content-Type": "application/json" };
                fetch('/pawnOut', { method: 'post', body, headers })
                new TWEEN.Tween(donePawn.position) // co
                    .to({ x: donePawn.position.x, y: 100, z: donePawn.position.z }, 500)
                    .repeat(0)
                    .easing(TWEEN.Easing.Bounce.Out)
                    .start()
                this.pawns.splice(this.pawns.indexOf(donePawn), 1)
            }

            this.pawns.find(item => item == this.markedPawn).changeX(intersects[0].object.x)
            this.pawns.find(item => item == this.markedPawn).changeY(intersects[0].object.y)

            let body = JSON.stringify({ pawnToMove: this.markedPawn.position, whereToMove: { x: intersects[0].object.position.x, z: intersects[0].object.position.z }, user: this.side })
            const headers = { "Content-Type": "application/json" };
            fetch('/pawnMove', { method: 'post', body, headers })
            new TWEEN.Tween(this.markedPawn.position) // co
                .to({ x: intersects[0].object.position.x, z: intersects[0].object.position.z }, 1000)
                .repeat(0)
                .easing(TWEEN.Easing.Bounce.Out)
                .onComplete(() => { this.markedPawn = null })
                .start()
            this.move = 'opponent'
            ui.changeMoveInt(this.move)
            this.fields.forEach(item => {
                if (item.name == 'blackfield') item.changeMaterial(this.BoardPieceMaterialDark)
            });
        }
    }
    render = () => {
        TWEEN.update()
        requestAnimationFrame(this.render);
        this.renderer.render(this.scene, this.camera);
    }
    manageOppMove = async (data) => {
        if (Object.keys(data).length > 0) {
            console.log("a")
            if (!data.out) {
                let pawntomove = this.pawns.find(item => { return item.position.x == data.pawnToMove.x && item.position.z == data.pawnToMove.z })
                let fieldtomove = this.fields.find(item => { return item.position.x == data.whereToMove.x && item.position.z == data.whereToMove.z })
                // console.log(pawntomove.x + ' ' + pawntomove.y)
                // console.log(fieldtomove.x + ' ' + fieldtomove.y)
                this.pionki[pawntomove.y][pawntomove.x] == 0
                this.pionki[fieldtomove.y][fieldtomove.x] == (pawntomove.name.includes('black')) ? 2 : 1
                pawntomove.changeX(fieldtomove.x)
                pawntomove.changeY(fieldtomove.y)
                new TWEEN.Tween(pawntomove.position)
                    .to({ x: data.whereToMove.x, z: data.whereToMove.z }, 500)
                    .repeat(0)
                    .easing(TWEEN.Easing.Bounce.Out)
                    .start()
            } else if (data.out) {
                let pawnOut = this.pawns.find(item => { return item.position.x == data.pawnToMove.x && item.position.z == data.pawnToMove.z })
                this.pionki[pawnOut.y][pawnOut.x] = 0
                this.pawns.splice(this.pawns.indexOf(pawnOut), 1)
                await new Promise(r => setTimeout(r, 300));
                new TWEEN.Tween(pawnOut.position) // co
                    .to({ x: pawnOut.position.x, y: 100, z: pawnOut.position.z }, 500)
                    .repeat(0)
                    .easing(TWEEN.Easing.Bounce.Out)
                    .start()
            }
            this.move = 'you'
            ui.changeMoveInt(this.move)
        }
    }
}

export default Game