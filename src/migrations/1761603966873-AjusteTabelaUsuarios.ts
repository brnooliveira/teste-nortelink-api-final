import { MigrationInterface, QueryRunner } from "typeorm";

export class AjusteTabelaUsuarios1761603966873 implements MigrationInterface {
    name = 'AjusteTabelaUsuarios1761603966873'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."livros_status_enum" AS ENUM('lendo', 'lido', 'a_ler')`);
        await queryRunner.query(`CREATE TABLE "livros" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "titulo" character varying(100) NOT NULL, "url_livro" character varying NOT NULL, "status" "public"."livros_status_enum" NOT NULL, "data_status" TIMESTAMP, "autor_id" uuid, "assunto_id" uuid, CONSTRAINT "PK_69daba516e6b0dd45f49c4d8d52" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "usuarios" ADD "refreshToken" character varying NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "livros" ADD CONSTRAINT "FK_04cc6a5eb11a1f1105d2f796261" FOREIGN KEY ("autor_id") REFERENCES "autores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "livros" ADD CONSTRAINT "FK_2a3c36446946bd35ce33cdc2e54" FOREIGN KEY ("assunto_id") REFERENCES "assuntos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "livros" DROP CONSTRAINT "FK_2a3c36446946bd35ce33cdc2e54"`);
        await queryRunner.query(`ALTER TABLE "livros" DROP CONSTRAINT "FK_04cc6a5eb11a1f1105d2f796261"`);
        await queryRunner.query(`ALTER TABLE "usuarios" DROP COLUMN "refreshToken"`);
        await queryRunner.query(`DROP TABLE "livros"`);
        await queryRunner.query(`DROP TYPE "public"."livros_status_enum"`);
    }

}
