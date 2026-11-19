import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateVersions1795110080850 implements MigrationInterface {
    name = 'CreateVersions1795110080850'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "versions" ("node_version" character varying NOT NULL, "node_id" uuid NOT NULL, "is_current" boolean NOT NULL DEFAULT false, "file_type" character varying(255) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e07368f845e65f6929cb272a7f4" PRIMARY KEY ("node_version", "node_id"))`);
        await queryRunner.query(`ALTER TABLE "nodes" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "versions" ADD CONSTRAINT "FK_7b4278b0325c6fc56704f8559df" FOREIGN KEY ("node_id") REFERENCES "nodes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "versions" DROP CONSTRAINT "FK_7b4278b0325c6fc56704f8559df"`);
        await queryRunner.query(`ALTER TABLE "nodes" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`DROP TABLE "versions"`);
    }

}
