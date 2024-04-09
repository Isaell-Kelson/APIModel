import { FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface EventoInput {
    categoria: string;
    userId: number;
}

interface EventoUpdateInput {
    categoria?: string;
}


export const createEvento = async (req: FastifyRequest<{ Body: EventoInput & { diasSenhas: { dia: string, senha: string }[] } }>, reply: FastifyReply): Promise<void> => {
    const { categoria, userId, diasSenhas } = req.body;

    try {

        const evento = await prisma.evento.create({
            data: {
                categoria,
                userId,
                dias: {
                    createMany: {
                        data: diasSenhas.map(({ dia, senha }) => ({
                            dia,
                            senha
                        }))
                    }
                }
            },
        });

        reply.code(201).send({ message: 'Evento criado com sucesso', evento });
    } catch (error) {
        console.error('Erro ao criar evento:', error);
        reply.code(500).send({ error: 'Erro interno do servidor' });
    }
}


export const getEvento = async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
    try {
        const eventos = await prisma.evento.findMany({
            include: {
                dias: true,
            },
        });

        reply.code(200).send({ message: 'Eventos encontrados com sucesso', eventos});
    } catch (error) {
        console.error('Erro ao buscar eventos:', error);
        reply.code(500).send({ error: 'Erro interno do servidor' });
    }
};


export const getEventoById = async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply): Promise<void> => {
    const { id } = req.params;

    try {
        const evento = await prisma.evento.findUnique({
            where: {
                id: parseInt(id),
            },
            include: {
                dias: true,
            },
        });

        if (!evento) {
            return reply.code(404).send({ error: 'Evento não encontrado' });
        }

        reply.code(200).send({ message: 'Evento encontrado com sucesso', evento });
    } catch (error) {
        console.error('Erro ao buscar evento por ID:', error);
        reply.code(500).send({ error: 'Erro interno do servidor' });
    }
};


export const updateEvento = async (req: FastifyRequest<{ Params: { id: string }, Body: EventoUpdateInput & { diasSenhas?: { dia: string, senha: string }[] } }>, reply: FastifyReply): Promise<void> => {
    const { id } = req.params;
    const { categoria, diasSenhas } = req.body;

    try {

        if (categoria) {
            await prisma.evento.update({
                where: {
                    id: parseInt(id),
                },
                data: {
                    categoria,
                },
            });
        }


        if (diasSenhas) {

            await prisma.diaSenha.deleteMany({
                where: {
                    eventoId: parseInt(id),
                },
            });


            for (const { dia, senha } of diasSenhas) {
                await prisma.diaSenha.create({
                    data: {
                        dia,
                        senha,
                        eventoId: parseInt(id),
                    },
                });
            }
        }

        reply.code(200).send({ message: 'Evento atualizado com sucesso' });
    } catch (error) {
        console.error('Erro ao atualizar evento:', error);
        reply.code(500).send({ error: 'Erro interno do servidor' });
    }
};


export const deleteEvento = async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply): Promise<void> => {
    const { id } = req.params;

    try {

        await prisma.diaSenha.deleteMany({
            where: {
                eventoId: parseInt(id),
            },
        });


        const deletedEvento = await prisma.evento.delete({
            where: {
                id: parseInt(id),
            },
        });

        if (!deletedEvento) {
            return reply.code(404).send({ error: 'Evento não encontrado' });
        }

        reply.code(204).send({ message: 'Evento deletado com sucesso' });
    } catch (error) {
        console.error('Erro ao deletar evento:', error);
        reply.code(500).send({ error: 'Erro interno do servidor' });
    }
};
