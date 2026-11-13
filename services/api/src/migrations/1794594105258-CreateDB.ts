import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDB1794594105258 implements MigrationInterface {
    name = 'CreateDB1794594105258'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "nodes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "is_folder" boolean NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "parent_id" uuid, CONSTRAINT "PK_682d6427523a0fa43d062ea03ee" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "nodes" ADD CONSTRAINT "FK_cc5eb8fb76e5f05aaf7a7e65bef" FOREIGN KEY ("parent_id") REFERENCES "nodes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "nodes" DROP CONSTRAINT "FK_cc5eb8fb76e5f05aaf7a7e65bef"`);
        await queryRunner.query(`DROP TABLE "nodes"`);
    }

}
