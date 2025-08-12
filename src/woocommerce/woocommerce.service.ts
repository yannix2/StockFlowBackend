// src/woocommerce/woocommerce.service.ts
import { Injectable } from '@nestjs/common';
import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../products/products.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WooCommerceService {
  private api: WooCommerceRestApi;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {
    this.api = new WooCommerceRestApi({
      url: this.configService.get<string>('WOOCOMMERCE_URL')!,
      consumerKey: this.configService.get<string>('WOOCOMMERCE_CONSUMER_KEY')!,
      consumerSecret: this.configService.get<string>('WOOCOMMERCE_CONSUMER_SECRET')!,
      version: 'wc/v3',
    });
  }

  /** ✅ Map BD ➜ Woo Payload */
  private mapLocalToWooPayload(p: Product): any {
    return {
      name: p.name,
      sku: p.sku,
      type: p.type || 'simple',
      status: p.status || 'publish',
      regular_price: p.price?.toString() || '0',
      stock_quantity: p.stockQuantity ?? 0,
      manage_stock: p.manageStock ?? false,
      stock_status: p.stockStatus ?? 'instock',
      weight: p.weight || '',
      dimensions: {
        length: p.dimensions?.length?.toString() || '',
        width: p.dimensions?.width?.toString() || '',
        height: p.dimensions?.height?.toString() || '',
      },
      categories: (p.categories || []).map((name) => ({ name })),
      tags: (p.tags || []).map((name) => ({ name })),
      images: (p.images || []).map((src) => ({ src })),
    };
  }

  /** ✅ Map Woo ➜ BD */
  private mapWooToLocalPayload(woo: any): Partial<Product> {
    return {
      wooId: woo.id,
      name: woo.name,
      sku: woo.sku,
      price: parseFloat(woo.price || woo.regular_price || '0'),
      type: woo.type,
      status: woo.status,
      stockQuantity: woo.stock_quantity,
      stockStatus: woo.stock_status,
      manageStock: woo.manage_stock,
      weight: woo.weight,
      dimensions: woo.dimensions,
      categories: woo.categories?.map((c) => c.name) || [],
      tags: woo.tags?.map((t) => t.name) || [],
      images: woo.images?.map((img) => img.src) || [],
    };
  }

  /** ✅ Import Woo ➜ BD */
  async importFromWoo(): Promise<{ imported: number; updated: number }> {
    const res = await this.api.get('products', { per_page: 100 });
    const products = res.data;
    let imported = 0;
    let updated = 0;

    for (const woo of products) {
      const existing = await this.productRepo.findOne({
        where: [{ wooId: woo.id }, { sku: woo.sku }],
      });

      const mapped = this.mapWooToLocalPayload(woo);

      if (existing) {
        await this.productRepo.update(existing.id, mapped);
        updated++;
      } else {
        await this.productRepo.save(this.productRepo.create(mapped));
        imported++;
      }
    }

    console.log(`✅ Import terminé: ${imported} créés, ${updated} mis à jour.`);
    return { imported, updated };
  }

  /** ✅ Export BD ➜ Woo */
  async exportToWoo(): Promise<{ created: number; updated: number }> {
    const products = await this.productRepo.find();
    let created = 0;
    let updated = 0;

    for (const local of products) {
      const payload = this.mapLocalToWooPayload(local);

      try {
        if (local.wooId) {
          // Produit déjà lié ➜ update
          await this.api.put(`products/${local.wooId}`, payload);
          updated++;
        } else {
          // Nouveau produit ➜ create
          const res = await this.api.post('products', payload);
          local.wooId = res.data.id;
          await this.productRepo.save(local);
          created++;
        }
      } catch (err) {
        console.error(`❌ Erreur export SKU=${local.sku}:`, err.response?.data || err.message);
      }
    }

    console.log(`✅ Export terminé: ${created} créés, ${updated} mis à jour.`);
    return { created, updated };
  }

  /** ✅ Sync intelligente : compare BD et Woo */
  async syncSmart(): Promise<void> {
    console.log('🔄 Sync intelligente BD ↔ Woo en cours...');
    await this.importFromWoo(); // Mise à jour des infos Woo ➜ BD
    await this.exportToWoo();   // Mise à jour des infos BD ➜ Woo
    console.log('✅ Sync intelligente terminée.');
  }


}
