import express from "express"
import { PrismaClient } from '@prisma/client';
import crypto from "crypto"
import jwt from "jsonwebtoken"
import dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient()
const App = express()

const SECRET = process.env.TOKEN

export function sha256(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

function authToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user;
        next();
    })
}


App.use(express.json())


App.post('/register', async (req, res) => {
    const { username, password } = req.body;

    const passwordHashed = sha256(password)

    const findUser = await prisma.user.findUnique({
        where: {
            username: username
        }
    })
    if (!username || !password) {
        return res.status(400).json({
            "code": "400",
            "message": "Precisa preencher todos os campos!"
        }).end()
    }
    if (findUser) {
        return res.status(400).json({
            "code": "400",
            "message": "Usuario ja existe!"
        }).end()
    }

    const createUser = await prisma.user.create({
        data: {
            username: username,
            password: passwordHashed
        }
    })

    const token = jwt.sign(
        { id: loginUser.id, username: createUser.username },
        SECRET,
        { expiresIn: "1h" }
    )

    res.status(201).json({
        "createUser": createUser,
        "token": token
    }).end()
})

App.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const passwordHashed = sha256(password)

    const loginUser = await prisma.user.findFirst({
        where: {
            username: username,
            password: passwordHashed
        }
    })

    if(!loginUser){
        res.status(400).json({
            "code": 400,
            "message": "Não foi encontrada conta!"
        }).end()
    }

    const token = jwt.sign(
        { id: loginUser.id, username: loginUser.username },
        SECRET,
        { expiresIn: "1h" }
    )

    res.status(201).json({
        "loginUser": loginUser,
        "token": token
    }).end()
})

App.post('/create-task', authToken, async (req, res) => {
    const { titulo, descricao, prioridade, prazo } = req.body;

    const userId = req.user.id

    const createTask = await prisma.tarefa.create({
        data: {
            titulo: titulo,
            descricao: descricao,
            prioridade: prioridade,
            status: "Pendente",
            prazo: new Date(prazo),
            user: {
                connect: { id: userId }
            }
        }
    })

    res.status(200).json({
        "code": "200",
        "message": "Tarefa: " + titulo + " feita com sucesso!"
    }).end()
})

App.get('', authToken, async (req, res) => {
    const userId = req.user.id;
    const hoje = new Date();
    console.log("TEXTO AI CHEFE: " + req.user.id)

    try {
        const updateTask = await prisma.tarefa.updateMany({ // fazer update das tarefas atrasadas automaticamente
            where: {
                userId: Number(userId),
                prazo: {
                    lt: hoje
                }
            },
            data: {
                status: "Atrasada"
            }
        })
    }
    catch {
        res.status(200).json({
            "message": "Nenhuma tarefa encontrada"
        })
    }
    const findTask = await prisma.tarefa.findMany({ // trazer todas as tarefas pendentes
        where: {
            userId: Number(userId),
            prazo: {
                gte: hoje,
            },
            status: "Pendente"
        }
    });

    const findTaskLate = await prisma.tarefa.findMany({ // trazer todas as tarefas atrasadas
        where: {
            userId: Number(userId),
            prazo: {
                lt: hoje,
            },
            status: "Atrasada"
        }
    })

    const findTaskCompleted = await prisma.tarefa.findMany({
        where: {
            userId: Number(userId),
            status: "Concluída"
        }
    })

    res.status(200).json({
        "code": "200",
        "message": "Tarefas puxadas!",
        "taskPending": findTask,
        "taskLate": findTaskLate,
        "taskCompleted": findTaskCompleted
    });
});

App.post('/completed-task', authToken, async (req, res) => {
    const { taskId } = req.body;
    const userId = req.user.id;

    const findTask = prisma.tarefa.findUnique({
        where:{
            id: taskId
        }
    })

    if(!findTask || findTask.userId !== userId){
        res.status(403).json({
            "code": 403,
            "message": "Acesso negado ou tarefa não encontrada!"
        }).end()
    }

    const completedTask = prisma.tarefa.update({
        where: {
            id: taskId,
            userId: userId
        },
        data: {
            status: "Concluída"
        }
    })

    res.status(201).json({
        "code": 201,
        "message": "Tarefa: " + (await completedTask).titulo + " concluída com sucesso!"
    }).end()
})

App.listen(3000)