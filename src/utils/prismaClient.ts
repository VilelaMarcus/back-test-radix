// prismaClient.js
import { Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

let prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs> | null = null;

const initPrisma = async () => {
    prisma = new PrismaClient();
};

const getInstance = async () => {
    
    if (prisma === null) {
        initPrisma();
    }
    
    return prisma;
};

const disconnect = async () => {
    if (prisma) {
        await prisma.$disconnect();
    }
};

export default { getInstance, initPrisma, disconnect };