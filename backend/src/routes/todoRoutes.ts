import Router from 'express'
import prisma from '../prisma.js'

export const todoRouter = Router()


todoRouter.get('/', async (req, res)=>{
    try{
        
        const todos = await prisma.todo.findMany({
            where: {
                user_id: parseInt(req.userId)
            },
            orderBy: {
                id: "asc"
            }
        })
        
        res.json(todos);
    }
    catch(e){

        res.send("Error")
    }
})

todoRouter.post('/', async(req, res)=>{
    const {task} = req.body

    const todo = await prisma.todo.create({
        data:{
            task,
            user_id: parseInt(req.userId)
        }
    })

    res.json(todo)
})



todoRouter.put('/:id', async(req, res)=>{
    const {id} = req.params
    const { completed } = req.body
    const userId = parseInt(req.userId)

    const updatedTodo = await prisma.todo.update({
        where:{
            id: parseInt(id)
        },
        data:{
            completed
        }
    })
    res.json(updatedTodo)

})

todoRouter.delete('/:id', async(req, res)=>{
    const {id} = req.params

    await prisma.todo.delete({
        where:{
            id: parseInt(id),
            user_id: parseInt(req.userId)
        }
    })

    res.send({message: "Todo deleted"})
})