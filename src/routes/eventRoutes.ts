import { FastifyInstance } from 'fastify';
import { createEvento, getEvento, getEventoById, updateEvento, deleteEvento } from '../controllers/eventController';

const eventRoutes = async (fastify: FastifyInstance) => {
    fastify.post('/eventos', createEvento);
    fastify.get('/eventos', getEvento);
    fastify.get('/eventos/:id', getEventoById);
    fastify.put('/eventos/:id', updateEvento);
    fastify.delete('/eventos/:id', deleteEvento);
};

export default eventRoutes;
