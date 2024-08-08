// Contributor.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Repository } from './repository';

@Entity()
export class Contributor {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  githubUsername!: string;

  @Column()
  firstCommitDate!: Date;

  @ManyToOne(() => Repository, (repository) => repository.contributors)
  repository!: Repository;
}