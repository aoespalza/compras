import prisma from '../prisma/client';
import { User, CreateUserDTO, UpdateUserDTO } from '../../domain/user';
import bcrypt from 'bcryptjs';

export class UserRepository {
  async findAll(): Promise<User[]> {
    const users = await prisma.user.findMany({
      orderBy: { username: 'asc' },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        name: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return users as User[];
  }

  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        name: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return user as User | null;
  }

  async findByUsername(username: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { username },
    }) as Promise<User | null>;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findFirst({
      where: { email },
    });
    return user as User | null;
  }

  async create(data: CreateUserDTO): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        name: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return user as User;
  }

  async update(id: string, data: UpdateUserDTO): Promise<User> {
    const updateData: any = { ...data };
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }
    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        name: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return user as User;
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({
      where: { id },
    });
  }

  async verifyPassword(username: string, password: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { username },
    });
    if (!user) return null;
    
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return null;
    
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }
}

export const userRepository = new UserRepository();
