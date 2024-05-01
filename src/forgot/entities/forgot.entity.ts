import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, DeleteDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Allow } from 'class-validator';
import { EntityHelper } from 'src/utils/entity-helper';

@Entity()
export class Forgot extends EntityHelper<Forgot> {
  @PrimaryGeneratedColumn()
  id: number;

  @Allow()
  @Column()
  hash: string;

  @Allow()
  @ManyToOne(() => User, {
    eager: true,
  })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
