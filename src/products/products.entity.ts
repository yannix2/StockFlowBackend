import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  sku: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  regularPrice?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  salePrice?: number;

  @Column({ default: 'simple' })
  type: string;

  @Column({ default: 'publish' })
  status: string;

  @Column({ type: 'int', nullable: true })
  stockQuantity?: number;

  @Column({ default: 'instock' })
  stockStatus: string;

  @Column({ default: false })
  manageStock: boolean;

  @Column({ nullable: true })
  weight?: string;

  @Column('json', { nullable: true })
  dimensions?: { length?: number; width?: number; height?: number };

  @Column({ type: 'jsonb', nullable: true, default: [] })
  categories: string[];

  @Column('simple-array', { nullable: true })
  tags?: string[];

  @Column('simple-array', { nullable: true })
  images?: string[];

  @Column('json', { nullable: true })
  attributes?: Record<string, any>;

  @Column('json', { nullable: true })
  variations?: any[];

  @Column({ nullable: true })
  purchaseNote?: string;

  @Column({ default: false })
  soldIndividually: boolean;

  /** ✅ Nouveaux champs pour synchronisation **/
  @Column({ nullable: true })
  wooId?: number;

  @Column({ type: 'timestamp', nullable: true })
  syncedAt?: Date;

  @Column({ default: 'pending' })
  syncStatus: 'pending' | 'synced' | 'error';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
