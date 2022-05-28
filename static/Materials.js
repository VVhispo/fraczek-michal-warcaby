class Materials {
    constructor(){
        this.BoardPieceMaterialLight = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide, // dwustronny
            map: new THREE.TextureLoader().load('./mats/light-board-piece.jpg'), // plik tekstury
            transparent: true
        })
        this.BoardPieceMaterialDark = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide, // dwustronny
            map: new THREE.TextureLoader().load('./mats/dark-board-piece.jpg'), // plik tekstury
            transparent: true
        })
        this.BoardPieceMaterialGlow = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide, // dwustronny
            color: '#66ff66',
            map: new THREE.TextureLoader().load('./mats/dark-board-piece.jpg'), // plik tekstury
            transparent: true
        })
        this.PieceMaterialDark = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide, // dwustronny
            map: new THREE.TextureLoader().load('./mats/dark-piece.jpg'), // plik tekstury
            transparent: true
        })
        this.PieceMaterialLight = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide, // dwustronny
            map: new THREE.TextureLoader().load('./mats/light-piece.jpg'), // plik tekstury
            transparent: true
        })
        this.PieceMaterialLightMarked = new THREE.MeshBasicMaterial({
            color: '#d5d973',
            side: THREE.DoubleSide, // dwustronny
            map: new THREE.TextureLoader().load('./mats/light-piece.jpg'), // plik tekstury
            transparent: true
        })
        this.PieceMaterialDarkMarked = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide, // dwustronny
            map: new THREE.TextureLoader().load('./mats/dark-piece-marked.png'), // plik tekstury
            transparent: true
        })
    }
}
export default Materials