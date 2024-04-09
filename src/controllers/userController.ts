import { FastifyRequest, FastifyReply } from 'fastify';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

interface CreateUserRequest {
    username: string;
    email: string;
    password: string;
}

interface LoginUserRequest {
    email: string;
    password: string;
}

const prisma = new PrismaClient();

export const createUser = async (req: FastifyRequest<{ Body: CreateUserRequest }>, reply: FastifyReply) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return reply.code(400).send({ error: 'Todos os campos são obrigatórios' });
    }

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return reply.code(400).send({ error: 'O usuário já existe' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
            },
        });

        reply.code(201).send(newUser);
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        reply.code(500).send({ error: 'Erro interno do servidor' });
    }
};

export const loginUser = async (req: FastifyRequest<{ Body: LoginUserRequest }>, reply: FastifyReply) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return reply.code(400).send({ error: 'Email e senha são obrigatórios' });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return reply.code(404).send({ error: 'Usuário não encontrado' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return reply.code(401).send({ error: 'Credenciais inválidas' });
        }

        reply.code(200).send({ message: 'Login bem-sucedido', user });
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        reply.code(500).send({ error: 'Erro interno do servidor' });
    }
};
