import { FastifyRequest, FastifyReply } from 'fastify';
import { AppError } from '../utils/AppError';
import { ZodError } from 'zod';

export async function errorHandling(error: any, request: FastifyRequest, reply: FastifyReply) {
    if (error instanceof AppError) {
        return reply.status(error.statusCode).send({ message: error.message });
    }
    if (error instanceof ZodError) {
        return reply.status(400).send({ message: 'Validation error', issues: error.format() });
    }

    return reply.status(500).send({ message: error.message });
}