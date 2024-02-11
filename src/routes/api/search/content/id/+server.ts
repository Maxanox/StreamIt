import { PrismaClient } from '@prisma/client';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const prisma = new PrismaClient()

export const POST: RequestHandler = async ({ request }) => {
	const { query } = await request.json();
	const animes = await prisma.anime.findMany({
		where: {
			id: {
                
            }
		},
	});
	return json(animes);
};

