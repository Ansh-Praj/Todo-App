var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Router from 'express';
import prisma from '../prisma.js';
export const todoRouter = Router();
todoRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const todos = yield prisma.todo.findMany({
            where: {
                user_id: parseInt(req.userId)
            },
            orderBy: {
                id: "asc"
            }
        });
        res.json(todos);
    }
    catch (e) {
        res.send("Error");
    }
}));
todoRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { task } = req.body;
    const todo = yield prisma.todo.create({
        data: {
            task,
            user_id: parseInt(req.userId)
        }
    });
    res.json(todo);
}));
todoRouter.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { completed } = req.body;
    const userId = parseInt(req.userId);
    const updatedTodo = yield prisma.todo.update({
        where: {
            id: parseInt(id)
        },
        data: {
            completed
        }
    });
    res.json(updatedTodo);
}));
todoRouter.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield prisma.todo.delete({
        where: {
            id: parseInt(id),
            user_id: parseInt(req.userId)
        }
    });
    res.send({ message: "Todo deleted" });
}));
