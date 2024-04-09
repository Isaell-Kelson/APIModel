import { FastifyInstance } from "fastify";
import { createUser, loginUser } from "../controllers/userController";

const userRoutes = async (fastify: FastifyInstance) => {
    fastify.post('/signup', createUser);
    fastify.post('/login', loginUser);
}

export default userRoutes;