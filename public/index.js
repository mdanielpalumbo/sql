const socket = io()

let send = null
let input = null
let mail = null



// Prods
const prodForm = document.getElementById("prodForm")
prodForm.addEventListener('submit', e => {
    e.preventDefault()

    let prod = [...prodForm].slice(0,3)
    prod = prod.map(p => p = p.value)
    prod = {
        name: prod[0],
        price: prod[1],
        thumb:prod[2]
    }
    socket.emit('prod',prod)
    
})

const prodsTable = document.getElementById('prods')

socket.on('prods', (prods) => {
    if(prods.length != 0){
        while(prodsTable.firstChild){
            prodsTable.removeChild(prodsTable.firstChild)
        }
        prodsTable.innerHTML =
        `
            <div class="tableTop">
                <p>Nombre</p>
                <p>Precio</p>
                <p>Imagen</p>
            </div>
        `
        prods.forEach(p => {
            let row = document.createElement('div')
            row.classList.add('prodRow')
            row.innerHTML = 
            `
                <div class="prod">
                    <div class="names"><p>${p.name}</p></div>
                    <div class="prices"><p>${p.price}</p></div>
                    <div class="thumbs"><img src='${p.thumb}'></div>
                </div>
            `
            prodsTable.appendChild(row)
        })
    }
    else{
        while(prodsTable.firstChild){
            prodsTable.removeChild(prodsTable.firstChild)
        }
        const table = document.createElement('div')
        table.classList.add("no")
        table.innerHTML = 
        `
            <p>NO HAY PRODUCTOS CARGADOS</p>
        `
        prodsTable.appendChild(table)
    }
})


// Chat
const mailInp = document.getElementById("mail")
document.getElementById("entry").addEventListener('click', () => {
    mail = mailInp.value
    document.getElementById('log').remove()
    console.log(mail)
    const chat = document.createElement("div")
    chat.id = "chat"
    chat.innerHTML = 
    `
        <div id="msgs">
        </div>
        <div class="input">
            <input id="msg" type="text">
            <button id="send">Enviar</button>
        </div>
    `
    const main = document.getElementById('main')
    main.appendChild(chat)
    send = document.getElementById("send")
    input = document.getElementById("msg")
    send.addEventListener('click', () => {
        time = Date()
        time = time.toString().split(' ')[4]
        socket.emit('msg', {msg: input.value, time: time, mail: mail})
        const empty = () => {
            input.value = ""
        }
        empty()
    })
    socket.emit('logged')
})

socket.on('msgs', msgs => {
    const chat = document.getElementById("msgs")
    while(chat.firstChild){
        chat.removeChild(chat.firstChild)
    }
    msgs.forEach(p => {
        let row = document.createElement("div")
        row.classList.add("row")        
        row.innerHTML = 
        ` 
            <p class="m">${p.mail} </p>
            <p class="msg">${p.msg}</p>
            <p class="t">${p.time}</p>
        `
        chat.appendChild(row)
    })
})

