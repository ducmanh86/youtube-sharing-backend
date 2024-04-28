import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Base } from '../../utils/base.entity';
import { Status } from '../../statuses/entities/status.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Video extends Base<Video> {
  @Column({ type: String })
  videoId: string;

  @ManyToOne(() => User, {
    eager: true,
  })
  @JoinColumn({ name: 'shareBy' })
  shareBy?: Status;
}
