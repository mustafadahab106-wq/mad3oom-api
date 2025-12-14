import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  listingId: number;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column()
  paymentMethod: string;

  @Column()
  status: string;

  @Column({ nullable: true })
  transactionId: string;

  @CreateDateColumn()
  createdAt: Date;
}