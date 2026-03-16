import prisma from '../prisma/client';
import { 
  PurchaseOrder, 
  CreatePurchaseOrderDTO, 
  UpdatePurchaseOrderDTO,
  PurchaseReceipt,
  CreatePurchaseReceiptDTO 
} from '../../domain/purchaseOrder';

export class PurchaseOrderRepository {
  async findAll(): Promise<PurchaseOrder[]> {
    return prisma.purchaseOrder.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        supplier: true,
        items: true,
        statusHistory: {
          orderBy: { changedAt: 'desc' },
        },
      },
    }) as Promise<PurchaseOrder[]>;
  }

  async findById(id: string): Promise<PurchaseOrder | null> {
    return prisma.purchaseOrder.findUnique({
      where: { id },
      include: {
        supplier: true,
        items: true,
        statusHistory: {
          orderBy: { changedAt: 'desc' },
        },
      },
    }) as Promise<PurchaseOrder | null>;
  }

  async findByStatus(status: string): Promise<PurchaseOrder[]> {
    return prisma.purchaseOrder.findMany({
      where: { status: status as any },
      orderBy: { createdAt: 'desc' },
      include: { supplier: true, items: true },
    }) as Promise<PurchaseOrder[]>;
  }

  async findBySupplier(supplierId: string): Promise<PurchaseOrder[]> {
    return prisma.purchaseOrder.findMany({
      where: { supplierId },
      orderBy: { createdAt: 'desc' },
      include: { items: true },
    }) as Promise<PurchaseOrder[]>;
  }

  async create(data: CreatePurchaseOrderDTO, createdById: string): Promise<PurchaseOrder> {
    const code = await this.generateCode();
    
    let subtotal = 0;
    const itemsData = data.items.map(item => {
      const total = item.unitPrice * item.quantity - (item.discount || 0);
      subtotal += total;
      return {
        materialId: item.materialId,
        description: item.description,
        quantity: item.quantity,
        unitOfMeasure: item.unitOfMeasure as any,
        unitPrice: item.unitPrice,
        discount: item.discount || 0,
        total,
      };
    });

    const tax = subtotal * 0.19;
    const total = subtotal + tax;

    return prisma.purchaseOrder.create({
      data: {
        code,
        supplierId: data.supplierId,
        projectName: data.projectName,
        description: data.description,
        deliveryAddress: data.deliveryAddress,
        requiredDate: data.requiredDate ? new Date(data.requiredDate) : null,
        expectedDelivery: data.expectedDelivery ? new Date(data.expectedDelivery) : null,
        paymentTerms: data.paymentTerms,
        deliveryTerms: data.deliveryTerms,
        subtotal,
        discount: 0,
        tax,
        total,
        createdById,
        items: {
          create: itemsData,
        },
        statusHistory: {
          create: {
            status: 'DRAFT',
            changedById: createdById,
            notes: 'Orden de compra creada',
          },
        },
      },
      include: { items: true },
    }) as Promise<PurchaseOrder>;
  }

  async update(id: string, data: UpdatePurchaseOrderDTO): Promise<PurchaseOrder> {
    return prisma.purchaseOrder.update({
      where: { id },
      data: {
        ...data,
        requiredDate: data.requiredDate ? new Date(data.requiredDate) : undefined,
        expectedDelivery: data.expectedDelivery ? new Date(data.expectedDelivery) : undefined,
      },
      include: { items: true },
    }) as Promise<PurchaseOrder>;
  }

  async updateStatus(id: string, status: string, changedById: string, notes?: string): Promise<PurchaseOrder> {
    const updateData: any = { status: status as any };
    
    if (status === 'CONFIRMED') {
      updateData.confirmationDate = new Date();
    } else if (status === 'RECEIVED') {
      updateData.receivedDate = new Date();
    }

    return prisma.purchaseOrder.update({
      where: { id },
      data: {
        ...updateData,
        statusHistory: {
          create: {
            status: status as any,
            changedById,
            notes,
          },
        },
      },
      include: { items: true },
    }) as Promise<PurchaseOrder>;
  }

  async delete(id: string): Promise<void> {
    await prisma.purchaseOrder.delete({
      where: { id },
    });
  }

  private async generateCode(): Promise<string> {
    const count = await prisma.purchaseOrder.count();
    const year = new Date().getFullYear();
    return `OC-${year}-${String(count + 1).padStart(4, '0')}`;
  }

  async count(): Promise<number> {
    return prisma.purchaseOrder.count();
  }

  async countPending(): Promise<number> {
    return prisma.purchaseOrder.count({
      where: { status: { in: ['DRAFT', 'SENT', 'CONFIRMED', 'IN_PROGRESS'] } },
    });
  }
}

export class PurchaseReceiptRepository {
  async findAll(): Promise<PurchaseReceipt[]> {
    return prisma.purchaseReceipt.findMany({
      orderBy: { receiptDate: 'desc' },
      include: {
        items: true,
      },
    }) as Promise<PurchaseReceipt[]>;
  }

  async findById(id: string): Promise<PurchaseReceipt | null> {
    return prisma.purchaseReceipt.findUnique({
      where: { id },
      include: {
        items: true,
      },
    }) as Promise<PurchaseReceipt | null>;
  }

  async findByPurchaseOrder(purchaseOrderId: string): Promise<PurchaseReceipt[]> {
    return prisma.purchaseReceipt.findMany({
      where: { purchaseOrderId },
      include: { items: true },
    }) as Promise<PurchaseReceipt[]>;
  }

  async create(data: CreatePurchaseReceiptDTO): Promise<PurchaseReceipt> {
    return prisma.purchaseReceipt.create({
      data: {
        purchaseOrderId: data.purchaseOrderId,
        receiptDate: data.receiptDate || new Date(),
        receivedBy: data.receivedBy,
        observations: data.observations,
        items: {
          create: data.items.map(item => ({
            purchaseOrderItemId: item.purchaseOrderItemId,
            quantityReceived: item.quantityReceived,
          })),
        },
      },
      include: { items: true },
    }) as Promise<PurchaseReceipt>;
  }

  async updateOrderItemReceived(itemId: string, quantityReceived: number): Promise<void> {
    const item = await prisma.purchaseOrderItem.findUnique({
      where: { id: itemId },
    });
    
    if (!item) return;

    const newQuantityReceived = item.quantityReceived + quantityReceived;
    let status: 'PENDING' | 'PARTIALLY_RECEIVED' | 'RECEIVED' = 'PARTIALLY_RECEIVED';
    
    if (newQuantityReceived >= item.quantity) {
      status = 'RECEIVED';
    }

    await prisma.purchaseOrderItem.update({
      where: { id: itemId },
      data: {
        quantityReceived: newQuantityReceived,
        status,
      },
    });
  }
}

export const purchaseOrderRepository = new PurchaseOrderRepository();
export const purchaseReceiptRepository = new PurchaseReceiptRepository();
