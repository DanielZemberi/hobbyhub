import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1703531665211 implements MigrationInterface {
    name = 'Default1703531665211'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`room\` text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`room\``);
    }

}
