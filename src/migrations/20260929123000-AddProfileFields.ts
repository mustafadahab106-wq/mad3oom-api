import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProfileFields20260929123000 implements MigrationInterface {
  name = 'AddProfileFields20260929123000';
  public async up(q: QueryRunner): Promise<void> {
    await q.query('ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "phone" varchar(30)');
    await q.query('ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "city" varchar(100)');
  }
  public async down(q: QueryRunner): Promise<void> {
    await q.query('ALTER TABLE "users" DROP COLUMN IF EXISTS "city"');
    await q.query('ALTER TABLE "users" DROP COLUMN IF EXISTS "phone"');
  }
}
