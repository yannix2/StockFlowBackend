// src/woocommerce/woocommerce.controller.ts
import { Controller, Get, Post, HttpCode, HttpStatus,Req,Body, Headers   } from '@nestjs/common';
import { WooCommerceService } from './woocommerce.service';

@Controller('woocommerce')
export class WooCommerceController {
  constructor(private readonly wooService: WooCommerceService) {}

  /**
   * ✅ Import Woo ➜ BD
   */
  @Post('import')
  @HttpCode(HttpStatus.OK)
  async importFromWoo() {
    console.log('⬇ Importation des produits depuis WooCommerce vers BD...');
    const result = await this.wooService.importFromWoo();
    return {
      message: '✅ Import Woo ➜ BD terminé',
      stats: result,
    };
  }

  /**
   * ✅ Export BD ➜ Woo
   */
  @Post('export')
  @HttpCode(HttpStatus.OK)
  async exportToWoo() {
    console.log('⬆ Exportation des produits depuis BD vers WooCommerce...');
    const result = await this.wooService.exportToWoo();
    return {
      message: '✅ Export BD ➜ Woo terminé',
      stats: result,
    };
  }

  /**
   * ✅ Sync intelligente BD ↔ Woo
   */
  @Post('sync')
  @HttpCode(HttpStatus.OK)
  async syncSmart() {
    console.log('🔄 Sync intelligente BD ↔ Woo démarrée...');
    await this.wooService.syncSmart();
    return {
      message: '✅ Synchronisation intelligente terminée',
    };
  }

 
}
