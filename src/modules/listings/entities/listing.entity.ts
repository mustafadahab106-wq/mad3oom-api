// src/modules/listings/entities/listing.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

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

  // الحقول المطلوبة للخدمة:
  @Column({ nullable: true })
  make: string;

  @Column({ nullable: true })
  model: string;

  @Column('int', { nullable: true })
  year: number;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  damageType: string;

  @Column({ nullable: true })
  legalStatus: string;

  @Column({ default: 'active' })
  status: string;

  @Column({ default: false })
  isFeatured: boolean;

  @Column({ type: 'timestamp', nullable: true })
  auctionEnd: Date;

  @Column({ default: 0 })
  views: number;

  @Column({ nullable: true })
  userId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}