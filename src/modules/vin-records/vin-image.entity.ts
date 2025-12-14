import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { VinRecord } from './vin-record.entity';

@Entity('vin_images')
export class VinImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  url: string;

  @Column()
  caption: string;

  @Column()
  order: number;

  @ManyToOne(() => VinRecord, (vinRecord) => vinRecord.images, {
    onDelete: 'CASCADE',
  })
  vinRecord: VinRecord;
}