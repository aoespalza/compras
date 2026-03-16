import nodemailer from 'nodemailer';
import { settingsUseCases } from '../application/settings/settingsUseCases';

let transporter: nodemailer.Transporter | null = null;

async function getTransporter(): Promise<nodemailer.Transporter | null> {
  try {
    const enabled = await settingsUseCases.getSetting('EMAIL_NOTIFICATIONS_ENABLED');
    if (!enabled || enabled.value !== 'true') {
      console.log('📧 Notificaciones de email deshabilitadas');
      return null;
    }

    const settings = await settingsUseCases.getEmailSettings();
    
    if (!settings.EMAIL_USER || !settings.EMAIL_PASS) {
      console.log('📧 Configuración de email incompleta');
      return null;
    }

    transporter = nodemailer.createTransport({
      host: settings.EMAIL_HOST,
      port: parseInt(settings.EMAIL_PORT) || 587,
      secure: settings.EMAIL_SECURE === 'true',
      auth: {
        user: settings.EMAIL_USER,
        pass: settings.EMAIL_PASS,
      },
    });

    return transporter;
  } catch (error) {
    console.error('📧 Error al configurar transporter:', error);
    return null;
  }
}

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export class EmailService {
  private async getFrom(): Promise<string> {
    try {
      const setting = await settingsUseCases.getSetting('EMAIL_FROM');
      return setting?.value || 'PROCURA <noreply@empresa.com>';
    } catch {
      return 'PROCURA <noreply@empresa.com>';
    }
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      const t = await getTransporter();
      if (!t) {
        console.log(`📧 Email simulado (deshabilitado): ${options.to} - ${options.subject}`);
        return;
      }

      const from = await this.getFrom();
      
      await t.sendMail({
        from,
        to: options.to,
        subject: options.subject,
        html: options.html,
      });
      console.log(`📧 Email enviado a ${options.to}: ${options.subject}`);
    } catch (error) {
      console.error('❌ Error al enviar email:', error);
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const t = await getTransporter();
      if (!t) {
        throw new Error('Configuración de email incompleta');
      }
      await t.verify();
      return true;
    } catch (error) {
      console.error('❌ Error verificando conexión email:', error);
      throw error;
    }
  }

  // Notificaciones de Solicitud de Cotización
  async notifyQuotationRequestCreated(request: any, creator: any): Promise<void> {
    const subject = `Nueva Solicitud de Cotización: ${request.code}`;
    const html = `
      <h2>Nueva Solicitud de Cotización</h2>
      <p>Se ha creado una nueva solicitud de cotización:</p>
      <ul>
        <li><strong>Código:</strong> ${request.code}</li>
        <li><strong>Título:</strong> ${request.title}</li>
        <li><strong>Proyecto:</strong> ${request.projectName || 'N/A'}</li>
        <li><strong>Prioridad:</strong> ${request.priority}</li>
        <li><strong>Fecha Requerida:</strong> ${request.requiredDate ? new Date(request.requiredDate).toLocaleDateString('es-CL') : 'N/A'}</li>
        <li><strong>Items:</strong> ${request.items?.length || 0}</li>
        <li><strong>Creado por:</strong> ${creator.name}</li>
      </ul>
      <p>Por favor ingrese al sistema para gestionar las cotizaciones.</p>
    `;
    await this.sendEmail({ to: creator.email, subject, html });
  }

  // Notificaciones de Cotización
  async notifyQuotationReceived(quotation: any, supplier: any): Promise<void> {
    const subject = `Cotización Recibida: ${quotation.code}`;
    const html = `
      <h2>Cotización Recibida</h2>
      <p>Se ha recibido una nueva cotización:</p>
      <ul>
        <li><strong>Código:</strong> ${quotation.code}</li>
        <li><strong>Proveedor:</strong> ${supplier.name}</li>
        <li><strong>Fecha:</strong> ${new Date(quotation.quotationDate).toLocaleDateString('es-CL')}</li>
        <li><strong>Total:</strong> $${quotation.total?.toLocaleString('es-CL')}</li>
        <li><strong>Estado:</strong> ${quotation.status}</li>
      </ul>
    `;
    await this.sendEmail({ to: 'admin@empresa.com', subject, html });
  }

  async notifyQuotationAccepted(quotation: any, supplier: any): Promise<void> {
    const subject = `Cotización Aceptada: ${quotation.code}`;
    const html = `
      <h2>Cotización Aceptada</h2>
      <p>Su cotización ha sido aceptada:</p>
      <ul>
        <li><strong>Código:</strong> ${quotation.code}</li>
        <li><strong>Total:</strong> $${quotation.total?.toLocaleString('es-CL')}</li>
        <li><strong>Fecha:</strong> ${new Date().toLocaleDateString('es-CL')}</li>
      </ul>
      <p>Se procederá a generar la Orden de Compra correspondiente.</p>
    `;
    await this.sendEmail({ to: supplier.email, subject, html });
  }

  // Notificaciones de Orden de Compra
  async notifyPurchaseOrderCreated(order: any, supplier: any): Promise<void> {
    const subject = `Nueva Orden de Compra: ${order.code}`;
    const html = `
      <h2>Nueva Orden de Compra</h2>
      <p>Se ha generado una nueva orden de compra:</p>
      <ul>
        <li><strong>Código:</strong> ${order.code}</li>
        <li><strong>Proveedor:</strong> ${supplier.name}</li>
        <li><strong>Fecha:</strong> ${new Date(order.orderDate).toLocaleDateString('es-CL')}</li>
        <li><strong>Total:</strong> $${order.total?.toLocaleString('es-CL')}</li>
        <li><strong>Estado:</strong> ${order.status}</li>
      </ul>
      <p>Por favor confirme la recepción de esta orden.</p>
    `;
    await this.sendEmail({ to: supplier.email, subject, html });
  }

  async notifyPurchaseOrderConfirmed(order: any): Promise<void> {
    const subject = `Orden de Compra Confirmada: ${order.code}`;
    const html = `
      <h2>Orden de Compra Confirmada</h2>
      <p>La orden de compra ha sido confirmada:</p>
      <ul>
        <li><strong>Código:</strong> ${order.code}</li>
        <li><strong>Fecha de Confirmación:</strong> ${new Date().toLocaleDateString('es-CL')}</li>
        <li><strong>Estado:</strong> ${order.status}</li>
      </ul>
    `;
    await this.sendEmail({ to: 'admin@empresa.com', subject, html });
  }

  async notifyPurchaseOrderReceived(order: any): Promise<void> {
    const subject = `Orden de Compra Recibida: ${order.code}`;
    const html = `
      <h2>Orden de Compra Recibida</h2>
      <p>La orden de compra ha sido marcada como recibida:</p>
      <ul>
        <li><strong>Código:</strong> ${order.code}</li>
        <li><strong>Fecha de Recepción:</strong> ${new Date().toLocaleDateString('es-CL')}</li>
      </ul>
    `;
    await this.sendEmail({ to: 'admin@empresa.com', subject, html });
  }
}

export const emailService = new EmailService();
