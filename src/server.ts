import Fastify from 'fastify';
import userRoutes from './routes/userRoutes';
import eventRoutes from "./routes/eventRoutes";

const app = Fastify();

app.register(require('@fastify/cors'));

app.register(userRoutes);
app.register(eventRoutes);



app.listen({
    host: '0.0.0.0',
    port: 3333,
}).then(() => {
    console.log('Servidor rodando na porta http://localhost:3333');
});
