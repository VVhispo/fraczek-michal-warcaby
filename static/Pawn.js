class Pawn extends THREE.Mesh {
    constructor(geometry, material, type, x, y) {
        super()
        this.name = type
        this.geometry = geometry
        this.material = material
        this.x = x
        this.y = y
    }
    changeX = (val) => this.x = val
    changeY = (val) => this.y = val
    changeMaterial = (value) => {
        this.material = value
    }
}
export default Pawn