import { instanceToPlain } from 'class-transformer';
import { AfterInsert, AfterLoad, BaseEntity } from 'typeorm';

export class EntityHelper<T> extends BaseEntity {
  __entity?: string;

  @AfterLoad()
  @AfterInsert()
  setEntityName() {
    this.__entity = this.constructor.name;
  }

  constructor(partial: Partial<T>) {
    super();
    Object.assign(this, partial);
  }

  toJSON() {
    return instanceToPlain(this);
  }
}
