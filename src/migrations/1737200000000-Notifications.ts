import { MigrationInterface, QueryRunner } from 'typeorm';

export class Notifications1737200000000 implements MigrationInterface {
  name = 'Notifications1737200000000';

  public async up(q: QueryRunner): Promise<void> {
    await q.query(`
      CREATE TABLE IF NOT EXISTS "notifications" (
        "id" SERIAL NOT NULL,
        "userId" integer NOT NULL,
        "type" character varying NOT NULL DEFAULT 'message',
        "title" character varying NOT NULL,
        "body" text NOT NULL,
        "conversationId" integer,
        "messageId" integer,
        "readAt" TIMESTAMP WITH TIME ZONE,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_notifications" PRIMARY KEY ("id")
      )
    `);
    await q.query(
      `CREATE INDEX IF NOT EXISTS "IDX_notifications_user_created" ON "notifications" ("userId", "createdAt")`,
    );
  }

  public async down(q: QueryRunner): Promise<void> {
    await q.query(`DROP TABLE IF EXISTS "notifications"`);
  }
}
