import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateComments1795544845917 implements MigrationInterface {
    name = 'CreateComments1795544845917'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "comments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "node_id" uuid NOT NULL, "node_version" character varying NOT NULL, "page" integer NOT NULL, "content" character varying(250) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "parent_id" uuid, CONSTRAINT "REL_d6f93329801a93536da4241e38" UNIQUE ("parent_id"), CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_59553d2599f3a38bcaee32f9472" FOREIGN KEY ("node_version", "node_id") REFERENCES "versions"("node_version","node_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_d6f93329801a93536da4241e386" FOREIGN KEY ("parent_id") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_d6f93329801a93536da4241e386"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_59553d2599f3a38bcaee32f9472"`);
        await queryRunner.query(`DROP TABLE "comments"`);
    }

}
