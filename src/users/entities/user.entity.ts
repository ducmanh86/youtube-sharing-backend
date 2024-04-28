import {
  Column,
  AfterLoad,
  Entity,
  ManyToOne,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import bcrypt from 'bcryptjs';
import { Exclude, Expose } from 'class-transformer';
import { Base } from '../../utils/base.entity';
import { Status } from '../../statuses/entities/status.entity';
import { AuthProvidersEnum } from '../../auth/auth-providers.enum';

@Entity()
export class User extends Base<User> {
  // For "string | null" we need to use String type.
  // More info: https://github.com/typeorm/typeorm/issues/2567
  @Column({ type: String, unique: true, nullable: true })
  email: string | null;

  @Column({ nullable: true })
  @Exclude({ toPlainOnly: true })
  password: string;

  @Exclude({ toPlainOnly: true })
  public previousPassword: string;

  public fullName: string;

  @AfterLoad()
  public loadPreviousPassword(): void {
    this.previousPassword = this.password;
    this.fullName = `${this.firstName} ${this.lastName}`.trim();
  }

  @BeforeInsert()
  @BeforeUpdate()
  async setPassword() {
    if (this.previousPassword !== this.password && this.password) {
      const salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  @Column({ default: AuthProvidersEnum.email })
  @Expose({ groups: ['me', 'admin'] })
  provider: string;

  @Column({ type: String, nullable: true })
  firstName: string | null;

  @Column({ type: String, nullable: true })
  lastName: string | null;

  @ManyToOne(() => Status, {
    eager: true,
  })
  status?: Status;

  @Column({ type: String, nullable: true })
  @Exclude({ toPlainOnly: true })
  hash: string | null;
}
