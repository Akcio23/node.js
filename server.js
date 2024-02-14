/*/npm -y para configuração do package.json 
// node XXX.js para executar o servidor -- node --watch xxx.js para uma execução continua

import {createServer} from 'node:http' //importando o mode http node


// criando função create server
const server = createServer((request, response)=> {
    response.write('Helo2 world')

    return response.end()
})


server.listen(3333) // configurando porta de entrada do servidor */
import { fastify } from "fastify";
//import { DatabaseMemory } from "./database-memory.js";
import { DatabasePostgres } from "./database-postgres.js";


const server = fastify()

//const database = new DatabaseMemory()
const database = new DatabasePostgres()

// GET = PEGAR , POST = CRIAR, PUT = AlTERAÇÂO, DELETE = DELEÇÃO, 


// POST http://localhost:3333/videos = criando um novo video 

// Request Body

server.post('/videos', async (request, reply) => {
    const { title, description, duration } = request.body

    await database.create({
        title,
        description,
        duration,
    })
    return reply.status(201).send()
})



// GET http://localhost:3333/videos  = Pegar video 
server.get('/videos', async (request) => {
    const search = request.query.search
    const videos = await database.list(search)
    return videos
})

// PUT  http://localhost:3333/videos/1 = ALTERAR 
 server.put('/videos/:id', async(request, reply) => {
    const videoId = request.params.id
    const { title, description, duration } = request.body


    await database.update(videoId, {
        title,
        description,
        duration
    })

    return reply.status(204).send()


})

// delete  http://localhost:3333/videos/1 = deletar 
server.delete('/videos/:id', async(request, reply) => {
    const videoId = request.params.id

    await database.delete(videoId)


    return reply.status(204).send()



})



server.listen({ port: process.env.PORT ?? 3333, })
