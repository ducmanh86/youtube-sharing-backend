import { MigrationInterface, QueryRunner } from 'typeorm';
import { BaseTable } from '../base-table';

export class CreateVideoTable1713824093410 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new BaseTable({
        name: 'video',
        columns: [
          {
            name: 'videoId',
            type: 'varchar',
            length: '20',
          },
          {
            name: 'shareBy',
            type: 'integer',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('video');
  }
}
