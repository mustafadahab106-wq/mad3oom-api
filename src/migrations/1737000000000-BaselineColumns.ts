import { MigrationInterface, QueryRunner } from 'typeorm';

// هذا الملف يسجّل بالكود كل الأعمدة اللي أضفناها يدويًا بـ SQL لين الآن.
// كل أمر مكتوب بأسلوب "IF NOT EXISTS" فآمن يشتغل حتى لو العمود موجود أصلاً.
export class BaselineColumns1737000000000 implements MigrationInterface {
  name = 'BaselineColumns1737000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "isAdmin" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "listings" ADD COLUMN IF NOT EXISTS "featuredUntil" timestamptz`,
    );
    await queryRunner.query(
      `ALTER TABLE "listings" ADD COLUMN IF NOT EXISTS "specs" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ADD COLUMN IF NOT EXISTS "plan" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "listings" ADD COLUMN IF NOT EXISTS "isCertified" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "listings" ADD COLUMN IF NOT EXISTS "consignmentScrapyardId" integer`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN IF EXISTS "consignmentScrapyardId"`);
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN IF EXISTS "isCertified"`);
    await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN IF EXISTS "plan"`);
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN IF EXISTS "specs"`);
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN IF EXISTS "featuredUntil"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "isAdmin"`);
  }
      }
