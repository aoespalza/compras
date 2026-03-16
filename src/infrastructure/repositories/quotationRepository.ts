import prisma from '../prisma/client';
import { 
  QuotationRequest, 
  CreateQuotationRequestDTO, 
  UpdateQuotationRequestDTO,
  Quotation,
  CreateQuotationDTO 
} from '../../domain/quotation';

export class QuotationRequestRepository {
  async findAll(): Promise<QuotationRequest[]> {
    return prisma.quotationRequest.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        items: true,
        quotations: {
          include: {
            supplier: true,
          },
        },
      },
    }) as Promise<QuotationRequest[]>;
  }

  async findById(id: string): Promise<QuotationRequest | null> {
    return prisma.quotationRequest.findUnique({
      where: { id },
      include: {
        items: true,
        quotations: {
          include: {
            supplier: true,
            items: true,
          },
        },
      },
    }) as Promise<QuotationRequest | null>;
  }

  async findByStatus(status: string): Promise<QuotationRequest[]> {
    return prisma.quotationRequest.findMany({
      where: { status: status as any },
      orderBy: { createdAt: 'desc' },
      include: { items: true },
    }) as Promise<QuotationRequest[]>;
  }

  async create(data: CreateQuotationRequestDTO, createdById: string): Promise<QuotationRequest> {
    const code = await this.generateCode();
    
    return prisma.quotationRequest.create({
      data: {
        code,
        title: data.title,
        description: data.description,
        projectName: data.projectName,
        priority: data.priority,
        requiredDate: data.requiredDate ? new Date(data.requiredDate) : null,
        deliveryAddress: data.deliveryAddress,
        createdById,
        items: {
          create: data.items.map(item => ({
            materialId: item.materialId,
            description: item.description,
            quantity: item.quantity,
            unitOfMeasure: item.unitOfMeasure as any,
            observations: item.observations,
          })),
        },
      },
      include: { items: true },
    }) as Promise<QuotationRequest>;
  }

  async update(id: string, data: UpdateQuotationRequestDTO): Promise<QuotationRequest> {
    return prisma.quotationRequest.update({
      where: { id },
      data: {
        ...data,
        requiredDate: data.requiredDate ? new Date(data.requiredDate) : undefined,
      },
      include: { items: true },
    }) as Promise<QuotationRequest>;
  }

  async delete(id: string): Promise<void> {
    await prisma.quotationRequest.delete({
      where: { id },
    });
  }

  async updateStatus(id: string, status: string): Promise<QuotationRequest> {
    return prisma.quotationRequest.update({
      where: { id },
      data: { status: status as any },
      include: { items: true },
    }) as Promise<QuotationRequest>;
  }

  async selectQuotation(quotationRequestId: string, quotationId: string): Promise<QuotationRequest> {
    return prisma.quotationRequest.update({
      where: { id: quotationRequestId },
      data: {
        selectedQuotationId: quotationId,
        status: 'APPROVED',
      },
      include: { items: true },
    }) as Promise<QuotationRequest>;
  }

  private async generateCode(): Promise<string> {
    const count = await prisma.quotationRequest.count();
    const year = new Date().getFullYear();
    return `SC-${year}-${String(count + 1).padStart(4, '0')}`;
  }

  async count(): Promise<number> {
    return prisma.quotationRequest.count();
  }
}

export class QuotationRepository {
  async findAll(): Promise<Quotation[]> {
    return prisma.quotation.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        supplier: true,
        items: true,
      },
    }) as Promise<Quotation[]>;
  }

  async findById(id: string): Promise<Quotation | null> {
    return prisma.quotation.findUnique({
      where: { id },
      include: {
        supplier: true,
        items: true,
      },
    }) as Promise<Quotation | null>;
  }

  async findByQuotationRequest(quotationRequestId: string): Promise<Quotation[]> {
    return prisma.quotation.findMany({
      where: { quotationRequestId },
      include: {
        supplier: true,
        items: true,
      },
    }) as Promise<Quotation[]>;
  }

  async create(data: CreateQuotationDTO, receivedById: string): Promise<Quotation> {
    const code = await this.generateCode();
    
    let subtotal = 0;
    const itemsData = data.items.map(item => {
      const total = item.unitPrice * item.quantity - (item.discount || 0);
      subtotal += total;
      return {
        quotationRequestItemId: item.quotationRequestItemId,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        discount: item.discount || 0,
        total,
        deliveryTime: item.deliveryTime,
        availability: item.availability,
        brand: item.brand,
        observations: item.observations,
      };
    });

    const tax = subtotal * 0.19;
    const total = subtotal + tax;

    return prisma.quotation.create({
      data: {
        code,
        quotationRequestId: data.quotationRequestId,
        supplierId: data.supplierId,
        validUntil: data.validUntil ? new Date(data.validUntil) : null,
        subtotal,
        discount: 0,
        tax,
        total,
        notes: data.notes,
        paymentTerms: data.paymentTerms,
        deliveryTime: data.deliveryTime,
        receivedById,
        items: {
          create: itemsData,
        },
      },
      include: { items: true },
    }) as Promise<Quotation>;
  }

  async updateStatus(id: string, status: string): Promise<Quotation> {
    return prisma.quotation.update({
      where: { id },
      data: { status: status as any },
      include: { items: true },
    }) as Promise<Quotation>;
  }

  private async generateCode(): Promise<string> {
    const count = await prisma.quotation.count();
    const year = new Date().getFullYear();
    return `COT-${year}-${String(count + 1).padStart(4, '0')}`;
  }

  async countQuotationRequests(): Promise<number> {
    return prisma.quotationRequest.count();
  }

  async countPendingQuotations(): Promise<number> {
    return prisma.quotation.count({
      where: { status: 'PENDING' },
    });
  }
}

export const quotationRequestRepository = new QuotationRequestRepository();
export const quotationRepository = new QuotationRepository();
