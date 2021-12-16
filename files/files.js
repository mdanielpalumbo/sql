const fs = require('fs')


module.exports = class Contenedor {
    constructor (nombre) {
        this.nombre = nombre
    }

    getAll = async () => {
        try {
            const contenido = await fs.promises.readFile(`${this.nombre}.txt`, 'utf-8')
            return JSON.parse(contenido)
        } catch (error) {
            await fs.promises.writeFile(`${this.nombre}.txt`, JSON.stringify([]))
            const contenido = await fs.promises.readFile(`${this.nombre}.txt`, 'utf-8')
            return JSON.parse(contenido)
        }
    }

    getById = async (id) => {
        const contenido = await this.getAll()
        const contBuscado = contenido.find(p => p.id == id)
        console.log(`Producto encontrado por ID N: ${id} ${contBuscado}`)
        return contBuscado
    }

    deleteById = async (id) => {
        try {
            const contenido = await this.getAll()
            let contDeleted = contenido.filter(p => p.id != id)
            contDeleted = contDeleted.map(p => {
                if (p.id > id){
                    p.id = p.id - 1
                }
                return p
            })
            await fs.promises.writeFile(`${this.nombre}.txt`, JSON.stringify(contDeleted))
            console.log(`archivo con ID ${id} eliminado con éxito `)
        } catch(error) {
            console.log(`No se pudo eliminar el producto. Error: ${error}`)
        }
    }

    deleteAll = async () => {
        await fs.promises.writeFile(`${this.nombre}.txt`, JSON.stringify([]))
        console.log("Archivos eliminados con éxito")
    }

    save = async (obj) => {
        const contenido = await this.getAll()
        const i = contenido.length
        obj.id = i + 1
        contenido.push(obj)
        try {
            await fs.promises.writeFile(`${this.nombre}.txt`, JSON.stringify(contenido))
            console.log("archivo guardado con exito")
            console.log(`id del archivo: ${obj.id}`)
        } catch(error){
            throw new Error('No se pudo guardar')
        }
    }
    
    actById = async (id, obj) => {
        const contenido = await this.getAll()
        obj.id = parseInt(id)
        const pre = contenido.map(p => {
            if(p.id == id){
                p = {...obj}
            }
            return p
        })
        await fs.promises.writeFile(`${this.nombre}.txt`, JSON.stringify(pre))
    }
}

