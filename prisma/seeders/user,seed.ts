import { PrismaClient } from '@prisma/client';
import { HashUtils } from '@utils/utils/hash/hash.utils';

export async function userSeeder(prisma: PrismaClient) {
  const emails = ['admin@mail.com', 'user@mail.com'];

  const AdminRole = await prisma.role.findFirst({
    where: {
      name: 'admin',
    },
  });

  const UserRole = await prisma.role.findFirst({
    where: {
      name: 'user',
    },
  });

  await prisma.user.createMany({
    data: emails.map((email) => ({
      email,
      password: HashUtils.generateHash('password'),
    })),
  });

  for (const email of emails) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) continue;

    await prisma.roleUser.create({
      data: {
        roleId: email.includes('admin') ? AdminRole.id : UserRole.id,
        userId: user.id,
      },
    });
  }

  console.log('User seed completed');
}
