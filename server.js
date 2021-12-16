const express = require('express')
const { Server: IOServer } = require('socket.io')
const { Server: HttpServer } = require('http')
const ContenedorDB = require('./files/filesDB')
const handlebars = require('express-handlebars')
const { optionsMDB } = require('./options/mariadb')
const { optionsql } = require('./options/sqlite')

const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

app.engine(
    "hbs",
    handlebars({
        extname: ".hbs",
        defaultLayout: "index.hbs",
        layoutsDir: __dirname + "/views",
    })
)
app.use(express.static('public'))
app.set("view engine", "hbs")

app.set("views", "./views")

app.get('/', (req,res) => {
    res.render('index', {y_n})
})

httpServer.listen(8080, () => {
    console.log('Escuchando correctamente el puerto 8080')
})

let y_n = true 

const prodsCont = new ContenedorDB(optionsMDB, 'prods')
const msgsCont = new ContenedorDB(optionsql, 'msgs')


io.on('connect', async (socket) => {
    let prods = await prodsCont.getAll()
    socket.emit('prods', prods)
    socket.on('logged',async ()=>{
        let msgs = await msgsCont.getAll()
        socket.emit('msgs', msgs)
    })
    socket.on('msg', async (msg) => {    
        await msgsCont.save(msg)
        let msgs = await msgsCont.getAll()
        io.sockets.emit('msgs', msgs)
    })
    socket.on('prod', async (prod) => {
        await prodsCont.save(prod)
        prods = await prodsCont.getAll()
        io.sockets.emit('prods', prods)
    })
    setInterval(async () => {
        await prodsCont.backUp()
    }, 60000)
})