import 'dotenv/config';
import { PrismaClient, Role } from "@generated";
import { hashSync } from "bcrypt";
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter: pool });

async function main() 
{
    const adminExists = await prisma.user.findFirst
    (
        {
            where: 
            {
                email: process.env.ADMIN_EMAIL?.toLowerCase(),
            },
        }
    );
    
    if (adminExists)
    {
        console.log(`User with email ${process.env.ADMIN_EMAIL?.toLowerCase()} already exists`);
        return;
    }
        else 
        {
            await prisma.user.create
            (
                {
                    data: 
                    {
                        fullName: process.env.ADMIN_FULLNAME?.toLowerCase()!,
                        email: process.env.ADMIN_EMAIL?.toLowerCase()!,
                        password: hashSync(process.env.ADMIN_PASSWORD!, 10),
                        role: Role.ADMIN,
                    },
                }
            )
            console.log(`User with email ${process.env.ADMIN_EMAIL?.toLowerCase()} created`);
        };
}
main()
    .then
    (async () => 
        {
            await prisma.$disconnect()
        }
    )
    .catch
    (async (e) => 
        {
            console.error(e);
            await prisma.$disconnect();
            process.exit(1);
        }
    );