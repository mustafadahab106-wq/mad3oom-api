import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Scrapyard } from './scrapyard.entity';

export enum FieldSourceType {
  FIELD_TEAM = 'field_team',
  SCRAPYARD_PARTNER = 'scrapyard_partner',
  DIRECT_SELLER = 'direct_seller',
}

export enum FieldInventoryStatus {
  DRAFT = 'draft',
  AVAILABLE = 'available',
  RESERVED = 'reserved',
  SOLD = 'sold',
}

export enum FieldVerificationStatus {
  VERIFIED = 'verified',
  NEEDS_RECHECK = 'needs_recheck',
  UNVERIFIED = 'unverified',
}

export enum DamageSeverity {
  LIGHT = 'light',
  MEDIUM = 'medium',
  HEAVY = 'heavy',
  UNKNOWN = 'unknown',
}

@Entity('field_vehicles')
export class FieldVehicle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column({ name: 'source_type', default: FieldSourceType.FIELD_TEAM })
  sourceType: FieldSourceType;

  @Column({ name: 'scrapyard_id', type: 'int', nullable: true })
  scrapyardId: number;

  @ManyToOne(() => Scrapyard, (scrapyard) => scrapyard.vehicles, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'scrapyard_id' })
  scrapyard: Scrapyard;

  @Column()
  make: string;

  @Column()
  model: string;

  @Column({ type: 'int' })
  year: number;

  @Column({ nullable: true })
  trim: string;

  @Column({ type: 'int', nullable: true })
  mileage: number;

  @Column({ nullable: true })
  vin: string;

  @Column({ nullable: true })
  origin: string;

  @Column({ nullable: true })
  transmission: string;

  @Column({ name: 'fuel_type', nullable: true })
  fuelType: string;

  @Column({ name: 'damage_types', type: 'jsonb', default: () => "'[]'" })
  damageTypes: string[];

  @Column({ name: 'damage_severity', default: DamageSeverity.UNKNOWN })
  damageSeverity: DamageSeverity;

  @Column({ name: 'damage_notes', type: 'text', nullable: true })
  damageNotes: string;

  @Column({ type: 'jsonb', default: () => "'[]'" })
  images: string[];

  @Column({ name: 'asking_price', type: 'decimal', precision: 12, scale: 2 })
  askingPrice: number;

  @Column({ default: 'AED' })
  currency: string;

  @Column({ default: false })
  negotiable: boolean;

  @Column({ name: 'inventory_status', default: FieldInventoryStatus.DRAFT })
  inventoryStatus: FieldInventoryStatus;

  @Column({ name: 'verification_status', default: FieldVerificationStatus.UNVERIFIED })
  verificationStatus: FieldVerificationStatus;

  @Column({ name: 'last_confirmed_at', type: 'timestamptz', nullable: true })
  lastConfirmedAt: Date;

  @Column({ name: 'internal_notes', type: 'text', nullable: true })
  internalNotes: string;

  @Column({ name: 'captured_by_user_id', type: 'int' })
  capturedByUserId: number;

  @Column({ name: 'published_listing_id', type: 'int', nullable: true })
  publishedListingId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
  }
