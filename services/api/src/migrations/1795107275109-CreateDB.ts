import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDB1795107275109 implements MigrationInterface {
    name = 'CreateDB1795107275109'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "versions" ("node_version" character varying NOT NULL, "node_id" uuid NOT NULL, "is_current" boolean NOT NULL DEFAULT false, "file_type" character varying(255) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e07368f845e65f6929cb272a7f4" PRIMARY KEY ("node_version", "node_id"))`);
        await queryRunner.query(`CREATE TABLE "nodes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "is_folder" boolean NOT NULL, "parent_id" uuid, CONSTRAINT "PK_682d6427523a0fa43d062ea03ee" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "versions" ADD CONSTRAINT "FK_7b4278b0325c6fc56704f8559df" FOREIGN KEY ("node_id") REFERENCES "nodes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "nodes" ADD CONSTRAINT "FK_cc5eb8fb76e5f05aaf7a7e65bef" FOREIGN KEY ("parent_id") REFERENCES "nodes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "nodes" DROP CONSTRAINT "FK_cc5eb8fb76e5f05aaf7a7e65bef"`);
        await queryRunner.query(`ALTER TABLE "versions" DROP CONSTRAINT "FK_7b4278b0325c6fc56704f8559df"`);
        await queryRunner.query(`DROP TABLE "nodes"`);
        await queryRunner.query(`DROP TABLE "versions"`);
    }

}
