const fs = require('fs')
const Contenedor = require('./files') 

module.exports = class ContenedorDB {
    constructor (options, tab) {
        this.knex = require('knex')(options)
        this.db = options.client
        this.tab = tab
        this.cont = new Contenedor(`./files/${tab}`)
        this.knex.schema.hasTable(`${this.tab}`).then(async (exists) => {
            if(!exists){
                if(this.db === 'mysql'){
                    console.log('mysql')
                    this.knex.schema.createTable(this.tab, table => {
                    table.increments("id")
                    table.string("name")
                    table.integer("price")
                    table.string("thumb")
                }).then(async () => {
                    const prods = await this.cont.getAll()
                    this.knex(`${this.tab}`).insert(prods).then(() => {console.log('archivo agregado')})
                })
                }if(this.db === 'sqlite3'){
                    console.log('sqlite')
                    this.knex.schema.createTable(this.tab, table => {
                    table.increments('id')
                    table.text('msg')
                    table.integer('time')
                    table.string('mail')
                }).then(async () => {
                    const msgs = await this.cont.getAll()
                    this.knex(`${this.tab}`).insert(msgs).then(()=> {console.log('msg guardado')})
                })
                }
            }
        })
                                    
    }

    getAll = async () => {
        try{
            const contenido = await this.knex.select('*').from(this.tab)
            return contenido       
        }catch(error){
            console.log(error)
        }
    }
    getById = async (id) => {
        const p = this.knex.select('*').where({id:id}).from(this.tab)
        return p
    }
    deleteById = async (id) => {
        await this.knex.from(this.tab).where({id:id}).del()
        console.log(`Producto de ${id} eliminado`)
    }
    deleteAll = async () => {
        await this.knex.from(this.tab).del()
        console.log('Productos eliminados')
    }
    save = async (obj) => {
        await this.knex.from(this.tab).insert(obj)
        console.log('Archivo guardado con éxito')
    }
    actById = async (id, obj) => {
        await this.knex.from(this.tab).where({id:id}).update(obj)
    }
    backUp = async () => {
        const db = await this.knex.from(this.tab).select('*')
        const back = await this.cont.getAll()
        const delta = db.length - back.length
        if(delta != 0){
            const toBack = db.slice(back.length, back.length + delta )
            for(let i of toBack){
                this.cont.save(i)
            }
            console.log('backup done')
        }else{
            console.log('none to backup')
        }
    }
}
