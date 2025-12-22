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

  @Column({ nullable: true })
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

  @Column({ type: 'datetime', nullable: true })
  auctionEnd: Date | null;

  @Column({ default: 0 })
  views: number;

  @Column({ nullable: true })
  userId: number;

  // ✅ الصور (متوافق مع SQLite/Postgres)
  // نخزنها كنص JSON: '["url1","url2"]'
  @Column('text', { nullable: true, default: '[]' })
  images: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
