import { MigrationInterface, QueryRunner } from "typeorm";

export class CriarTabelaAssuntos1761599054317 implements MigrationInterface {
    name = 'CriarTabelaAssuntos1761599054317'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "assuntos" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "descricao" character varying(100) NOT NULL, CONSTRAINT "PK_641bc8ebbfcee82c948262ab312" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "assuntos"`);
    }

}
