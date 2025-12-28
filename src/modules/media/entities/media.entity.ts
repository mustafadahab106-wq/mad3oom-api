// src/modules/media/entities/media.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('media')
export class Media {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @Column({ nullable: true })
  type: string;

  @Column({ nullable: true })
  userId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
