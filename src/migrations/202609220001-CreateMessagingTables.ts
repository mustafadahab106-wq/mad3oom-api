import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMessagingTables202609220001 implements MigrationInterface {
  name = 'CreateMessagingTables202609220001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "conversations" (
        "id" SERIAL NOT NULL,
        "user1Id" integer NOT NULL,
        "user2Id" integer NOT NULL,
        "listingId" integer,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_conversations_id" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_conversations_user1" ON "conversations" ("user1Id")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_conversations_user2" ON "conversations" ("user2Id")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_conversations_listing" ON "conversations" ("listingId")`);
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "UQ_conversations_members_listing"
      ON "conversations" ("user1Id", "user2Id", COALESCE("listingId", -1))
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "messages" (
        "id" SERIAL NOT NULL,
        "conversationId" integer NOT NULL,
        "senderId" integer NOT NULL,
        "body" text NOT NULL,
        "readAt" TIMESTAMP WITH TIME ZONE,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_messages_id" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_messages_conversation" ON "messages" ("conversationId", "createdAt")`);
    await queryRunner.query(`
      DO $$ BEGIN
        ALTER TABLE "messages"
        ADD CONSTRAINT "FK_messages_conversation"
        FOREIGN KEY ("conversationId") REFERENCES "conversations"("id") ON DELETE CASCADE;
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "messages"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "conversations"`);
  }
}
