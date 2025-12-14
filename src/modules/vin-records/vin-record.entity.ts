import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { VinImage } from './vin-image.entity';

@Entity('vin_records')
export class VinRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  vin: string;

  @Column()
  make: string;

  @Column()
  model: string;

  @Column()
  year: number;

  @Column()
  auction_name: string;

  @Column()
  lot_number: string;

  @Column()
  sold_price: number;

  @Column()
  damage_type: string;

  @OneToMany(() => VinImage, (img) => img.vinRecord, { cascade: true })
  images: VinImage[];
}