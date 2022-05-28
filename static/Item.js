class Field extends THREE.Mesh {
    constructor(geometry, material, color, x, y) {
        super()
        this.name = color
        this.geometry = geometry
        this.material = material
        this.x = x
        this.y = y
    }
    changeMaterial = (value) => {
        this.material = value
    }
}
export default Field