// src/modules/vin-records/entities/vin-record.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('vin_records')
export class VinRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 17 })
  vin: string;

  @Column({ length: 100 })
  make: string;

  @Column({ length: 100 })
  model: string;

  @Column('int')
  year: number;

  @Column({ name: 'auction_name', length: 200 })
  auction_name: string;

  @Column({ name: 'lot_number', length: 50 })
  lot_number: string;

  @Column({ name: 'sold_price', type: 'decimal', precision: 10, scale: 2 })
  sold_price: number;

  @Column({ name: 'damage_type', length: 100, nullable: true })
  damage_type: string;

  @Column({ 
    name: 'image_urls', 
    type: 'simple-array', 
    nullable: true 
  })
  imageUrls: string[];

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}