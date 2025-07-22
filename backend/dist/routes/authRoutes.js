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
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const authRouter = Router();
authRouter.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);
    try {
        const user = yield prisma.users.create({
            data: {
                username,
                password: hashedPassword
            }
        });
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "24h" });
        res.json({ token });
    }
    catch (err) {
        if (err.code === 'P2002') {
            return res.status(400).json({ message: "Username Already Exists!" });
        }
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
authRouter.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const user = yield prisma.users.findUnique({
            where: {
                username,
            }
        });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const isValid = bcrypt.compareSync(password, user === null || user === void 0 ? void 0 : user.password);
        if (!isValid) {
            res.status(401).json({ message: "Invalid Password" });
            return;
        }
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "24h" });
        res.json({ token });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
export default authRouter;
