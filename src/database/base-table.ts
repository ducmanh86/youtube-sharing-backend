import { Table } from 'typeorm';
import { TableOptions } from 'typeorm/schema-builder/options/TableOptions';

export class BaseTable extends Table {
  constructor(options?: TableOptions) {
    if (options?.columns) {
      options.columns.unshift({
        name: 'id',
        type: 'integer',
        isPrimary: true,
        isGenerated: true,
        generatedIdentity: 'ALWAYS',
        generatedType: 'STORED',
        generationStrategy: 'increment',
      });

      options.columns.push(
        {
          name: 'deletedAt',
          type: 'timestamp',
          isNullable: true,
        },
        {
          name: 'deletedBy',
          type: 'integer',
          isNullable: true,
        },
        {
          name: 'createdAt',
          type: 'timestamp',
          default: 'CURRENT_TIMESTAMP',
        },
        {
          name: 'createdBy',
          type: 'integer',
          isNullable: true,
        },
        {
          name: 'updatedAt',
          type: 'timestamp',
          default: 'CURRENT_TIMESTAMP',
        },
        {
          name: 'updatedBy',
          type: 'integer',
          isNullable: true,
        },
      );
    }

    super(options);
  }
}
