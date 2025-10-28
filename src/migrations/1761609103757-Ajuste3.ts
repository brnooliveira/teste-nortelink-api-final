import { MigrationInterface, QueryRunner } from "typeorm";

export class Ajuste31761609103757 implements MigrationInterface {
    name = 'Ajuste31761609103757'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "livros" ADD "url_imagem" character varying`);
        await queryRunner.query(`ALTER TABLE "livros" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "livros" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "livros" ALTER COLUMN "status" SET DEFAULT 'a_ler'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "livros" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "livros" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "livros" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "livros" DROP COLUMN "url_imagem"`);
    }

}
