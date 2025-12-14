import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('deletion_requests')
export class DeletionRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  listingId: number;

  @Column()
  userId: number;

  @Column({ type: 'text' })
  reason: string;

  @Column({ default: 'pending' })
  status: 'pending' | 'approved' | 'rejected';

  @CreateDateColumn()
  createdAt: Date;
}