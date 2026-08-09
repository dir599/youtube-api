import 'dotenv/config'
import { PrismaClient } from "../generated/prisma/client.js"; //@prisma/client
import { PrismaPg } from '@prisma/adapter-pg';

// console.log(process.env.DATABASE_URL);

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({adapter});
prisma.$connect()
  .then(() => console.log("Database connected ✅"))
  .catch((e) => console.log("Database error ❌", e.message))

export default prisma;
