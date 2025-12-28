// src/modules/listings/entities/listing.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('listings')
export class Listing {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  price: number;

  @Column({ nullable: true })
  make: string;

  @Column({ nullable: true })
  model: string;

  @Column('int', { nullable: true })
  year: number;

  // ✅ أضف mileage لأنه موجود في الفورم والسيرفس
  @Column('int', { nullable: true })
userId: number;


  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  damageType: string;

  @Column({ nullable: true })
  legalStatus: string;

  // ✅ أضف vin / whatsapp لأنك ترسلهم
  @Column({ nullable: true })
  vin: string;

  @Column({ nullable: true })
  whatsapp: string;

  // ✅ images مخزنة كسلسلة JSON
  @Column({ type: 'jsonb', default: () => "'[]'" })
images: string[];


  @Column({ default: 'active' })
  status: string;

  @Column({ default: false })
  isFeatured: boolean;

  @Column({ type: 'timestamptz', nullable: true })
auctionEnd: Date;

  @Column({ default: 0 })
  views: number;

  // ✅ الأفضل تحديد النوع int
  @Column('int', { nullable: true })
  

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
