import prisma from '../prisma/client';
import { Supplier, CreateSupplierDTO, UpdateSupplierDTO } from '../../domain/supplier';

export class SupplierRepository {
  async findAll(): Promise<Supplier[]> {
    return prisma.supplier.findMany({
      orderBy: { name: 'asc' },
    }) as Promise<Supplier[]>;
  }

  async findById(id: string): Promise<Supplier | null> {
    return prisma.supplier.findUnique({
      where: { id },
    }) as Promise<Supplier | null>;
  }

  async findByCode(code: string): Promise<Supplier | null> {
    return prisma.supplier.findUnique({
      where: { code },
    }) as Promise<Supplier | null>;
  }

  async findByName(name: string): Promise<Supplier | null> {
    return prisma.supplier.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } },
    }) as Promise<Supplier | null>;
  }

  async findByStatus(status: string): Promise<Supplier[]> {
    return prisma.supplier.findMany({
      where: { status: status as any },
      orderBy: { name: 'asc' },
    }) as Promise<Supplier[]>;
  }

  async create(data: CreateSupplierDTO): Promise<Supplier> {
    const code = await this.generateCode();
    return prisma.supplier.create({
      data: {
        ...data,
        code: data.code || code,
        categories: data.categories || [],
      },
    }) as Promise<Supplier>;
  }

  private async generateCode(): Promise<string> {
    const count = await prisma.supplier.count();
    const year = new Date().getFullYear();
    return `PROV-${year}-${String(count + 1).padStart(4, '0')}`;
  }

  async update(id: string, data: UpdateSupplierDTO): Promise<Supplier> {
    return prisma.supplier.update({
      where: { id },
      data,
    }) as Promise<Supplier>;
  }

  async delete(id: string): Promise<void> {
    await prisma.supplier.delete({
      where: { id },
    });
  }

  async updateStatus(id: string, status: string): Promise<Supplier> {
    return prisma.supplier.update({
      where: { id },
      data: { status: status as any },
    }) as Promise<Supplier>;
  }

  async count(): Promise<number> {
    return prisma.supplier.count();
  }

  async countActive(): Promise<number> {
    return prisma.supplier.count({
      where: { status: 'ACTIVE' },
    });
  }
}

export const supplierRepository = new SupplierRepository();
