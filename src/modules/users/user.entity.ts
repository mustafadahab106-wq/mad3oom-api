import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone?: string;

  @Column()
  passwordHash: string;

  @Column({ default: 'user' })
  role: 'user' | 'admin';

  @Column({ nullable: true })
  city?: string;

  @Column({ default: 0 })
  listingsCount: number;

  @Column({ default: 0 })
  favoritesCount: number;

  @Column({ nullable: true })
  avatar?: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ nullable: true })
  verificationCode?: string;

  @Column({ nullable: true })
  verificationExpires?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}