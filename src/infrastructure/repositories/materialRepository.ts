import prisma from '../prisma/client';
import { Material, CreateMaterialDTO, UpdateMaterialDTO } from '../../domain/material';

export class MaterialRepository {
  async findAll(): Promise<Material[]> {
    return prisma.material.findMany({
      orderBy: { name: 'asc' },
    }) as Promise<Material[]>;
  }

  async findById(id: string): Promise<Material | null> {
    return prisma.material.findUnique({
      where: { id },
    }) as Promise<Material | null>;
  }

  async findByCode(code: string): Promise<Material | null> {
    return prisma.material.findUnique({
      where: { code },
    }) as Promise<Material | null>;
  }

  async findByName(name: string): Promise<Material | null> {
    return prisma.material.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } },
    }) as Promise<Material | null>;
  }

  async findByCategory(category: string): Promise<Material[]> {
    return prisma.material.findMany({
      where: { category: category as any },
      orderBy: { name: 'asc' },
    }) as Promise<Material[]>;
  }

  async findActive(): Promise<Material[]> {
    return prisma.material.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    }) as Promise<Material[]>;
  }

  async create(data: CreateMaterialDTO): Promise<Material> {
    const code = await this.generateCode();
    return prisma.material.create({
      data: {
        ...data,
        code: data.code || code,
      },
    }) as Promise<Material>;
  }

  private async generateCode(): Promise<string> {
    const count = await prisma.material.count();
    return `MAT-${String(count + 1).padStart(5, '0')}`;
  }

  async update(id: string, data: UpdateMaterialDTO): Promise<Material> {
    return prisma.material.update({
      where: { id },
      data,
    }) as Promise<Material>;
  }

  async delete(id: string): Promise<void> {
    await prisma.material.delete({
      where: { id },
    });
  }

  async count(): Promise<number> {
    return prisma.material.count();
  }
}

export const materialRepository = new MaterialRepository();
