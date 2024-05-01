import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';
import { BaseTable } from '../base-table';

export class InitDatabase1688161010537 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'status',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '20',
          },
        ],
      }),
    );

    await queryRunner.createTable(
      new BaseTable({
        name: 'user',
        columns: [
          {
            name: 'email',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'firstName',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'lastName',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'provider',
            type: 'varchar',
            default: "'email'",
          },
          {
            name: 'password',
            type: 'varchar',
          },
          {
            name: 'hash',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'statusId',
            type: 'integer',
          },
        ],
      }),
    );
    await queryRunner.createIndex('user', new TableIndex({ columnNames: ['firstName'] }));
    await queryRunner.createIndex('user', new TableIndex({ columnNames: ['lastName'] }));
    await queryRunner.createIndex('user', new TableIndex({ columnNames: ['hash'] }));

    await queryRunner.createTable(
      new Table({
        name: 'forgot',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generatedIdentity: 'ALWAYS',
            generatedType: 'STORED',
            generationStrategy: 'increment',
          },
          {
            name: 'userId',
            type: 'integer',
          },
          {
            name: 'hash',
            type: 'varchar',
          },
          {
            name: 'deletedAt',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );
    await queryRunner.createIndex('forgot', new TableIndex({ columnNames: ['hash'] }));

    await queryRunner.createTable(
      new Table({
        name: 'session',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generatedIdentity: 'ALWAYS',
            generatedType: 'STORED',
            generationStrategy: 'increment',
          },
          {
            name: 'userId',
            type: 'integer',
          },
          {
            name: 'deletedAt',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );
    await queryRunner.createIndex('session', new TableIndex({ columnNames: ['userId'] }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('forgot');
    await queryRunner.dropTable('session');
    await queryRunner.dropTable('user');
    await queryRunner.dropTable('status');
  }
}
