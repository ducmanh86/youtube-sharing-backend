import { Column, CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { EntityHelper } from './entity-helper';
import { Exclude } from 'class-transformer';

export class Base<T> extends EntityHelper<T> {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Exclude({ toPlainOnly: true })
  @DeleteDateColumn({ nullable: true })
  deletedAt: Date | null;

  @Column({ type: Number, name: 'createdBy', nullable: true })
  createdBy: number | null;

  @Column({ type: Number, name: 'updatedBy', nullable: true })
  updatedBy: number | null;

  @Exclude({ toPlainOnly: true })
  @Column({ type: Number, name: 'deletedBy', nullable: true })
  deletedBy: number | null;
}
