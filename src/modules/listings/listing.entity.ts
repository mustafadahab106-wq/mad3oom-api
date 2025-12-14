import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('listings')
export class Listing {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.listings)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;

  @Column()
  make: string;

  @Column()
  model: string;

  @Column()
  year: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  city: string;

  @Column('simple-array', { nullable: true })
  images: string[];

  @Column({ nullable: true })
  mileage: number;

  @Column({ nullable: true })
  damageType: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  legalStatus: string;

  @Column({ nullable: true })
  vin: string;

  @Column({ nullable: true })
  whatsapp: string;

  @Column({ default: 'active' })
  status: 'active' | 'inactive' | 'sold' | 'pending';

  @Column({ default: 0 })
  views: number;

  @Column({ default: false })
  isFeatured: boolean;

  @Column({ nullable: true })
  featuredAt: Date;

  @Column({ nullable: true })
  auctionEnd: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
