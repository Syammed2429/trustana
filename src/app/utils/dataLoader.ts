import { Product } from '../types/product';
import { SupplierAttribute } from '../types/attribute';
import * as fs from 'fs';
import * as path from 'path';

export class DataLoader {
  private static productsCache: Product[] | null = null;
  private static attributesCache: SupplierAttribute[] | null = null;

  static getProducts(): Product[] {
    if (!this.productsCache) {
      try {
        const productsPath = path.join(process.cwd(), 'src/app/mockData/products.json');
        const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
        this.productsCache = productsData.products || [];
      } catch (error) {
        console.error('Error loading products:', error);
        this.productsCache = [];
      }
    }
    return this.productsCache || [];
  }

  static getAttributes(): SupplierAttribute[] {
    if (!this.attributesCache) {
      try {
        const attributesPath = path.join(process.cwd(), 'src/app/mockData/attributes.json');
        const attributesData = JSON.parse(fs.readFileSync(attributesPath, 'utf8'));
        this.attributesCache = attributesData.attributes || [];
      } catch (error) {
        console.error('Error loading attributes:', error);
        this.attributesCache = [];
      }
    }
    return this.attributesCache || [];
  }
}
