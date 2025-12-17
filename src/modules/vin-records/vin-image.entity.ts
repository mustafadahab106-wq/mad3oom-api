import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { VinRecord } from './vin-record.entity';

@Entity()
export class VinImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @Column({ nullable: true })
  caption: string;

  // 🔴 هذا الخطأ لأن vinRecord.images غير موجود
  // @ManyToOne(() => VinRecord, (vinRecord) => vinRecord.images)
  // vinRecord: VinRecord;
  
  // 🟢 الحل المؤقت: استخدم بدون علاقة عكسية
  @ManyToOne(() => VinRecord)
  vinRecord: VinRecord;
}