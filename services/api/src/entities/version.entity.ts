import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { ItemNode } from './node.entity';

@Entity('versions')
export class Version {
  @PrimaryColumn('varchar', { name: 'node_version' })
  nodeVersion!: string;

  @ManyToOne(() => ItemNode, (node) => node.versions, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'node_id' })
  node!: ItemNode;

  @PrimaryColumn('uuid', { name: 'node_id' })
  nodeId!: string;

  @Column({ name: 'is_current', type: 'boolean', default: false })
  isCurrent!: boolean;

  @Column({ name: 'file_type', type: 'varchar', length: 255 })
  fileType!: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;
}

export { Version as NodeVersion };