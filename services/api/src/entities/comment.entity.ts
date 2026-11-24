import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Version } from './version.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Version, (version) => version.comments, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn([
    { name: 'node_id', referencedColumnName: 'nodeId' },
    { name: 'node_version', referencedColumnName: 'nodeVersion' },
  ])
  version!: Version;

  @Column({ name: 'node_id', type: 'uuid' })
  nodeId!: string;

  @Column({ name: 'node_version', type: 'varchar' })
  nodeVersion!: string;

  @OneToOne(() => Comment, (comment) => comment.child, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parent_id' })
  parent!: Comment | null;

  @OneToOne(() => Comment, (comment) => comment.parent)
  child!: Comment | null;

  @Column({ type: 'integer' })
  page!: number;

  @Column({ type: 'varchar', length: 250 })
  content!: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;
}
