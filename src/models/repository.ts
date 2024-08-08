import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Contributor } from './contributor';

@Entity()
export class Repository {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  org!: string;

  @Column()
  name!: string;

  @OneToMany(() => Contributor, (contributor) => contributor.repository)
  contributors!: Contributor[];
}