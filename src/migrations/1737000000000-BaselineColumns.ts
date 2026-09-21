import { MigrationInterface, QueryRunner } from 'typeorm';

export class Messages1737100000000 implements MigrationInterface {
  name = 'Messages1737100000000';
  public async up(q: QueryRunner): Promise<void> {
    await q.query(`CREATE TABLE IF NOT EXISTS "conversations" ("id" SERIAL NOT NULL, "user1Id" integer NOT NULL, "user2Id" integer NOT NULL, "listingId" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_conversations" PRIMARY KEY ("id"))`);
    await q.query(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_conversation_pair_listing" ON "conversations" ("user1Id", "user2Id", COALESCE("listingId", 0))`);
    await q.query(`CREATE TABLE IF NOT EXISTS "messages" ("id" SERIAL NOT NULL, "conversationId" integer NOT NULL, "senderId" integer NOT NULL, "body" text NOT NULL, "readAt" TIMESTAMP WITH TIME ZONE, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_messages" PRIMARY KEY ("id"))`);
    await q.query(`CREATE INDEX IF NOT EXISTS "IDX_messages_conversation_created" ON "messages" ("conversationId", "createdAt")`);
  }
  public async down(q: QueryRunner): Promise<void> {
    await q.query(`DROP TABLE IF EXISTS "messages"`);
    await q.query(`DROP TABLE IF EXISTS "conversations"`);
  }
}
