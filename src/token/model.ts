import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Token {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  token!: string;

  @Column({ type: "boolean", nullable: false })
  stale!: boolean;
}
