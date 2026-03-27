import { Entity, Column, JoinColumn, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToOne, ManyToMany, JoinTable, OneToMany } from 'typeorm';

@Entity()
export class Customers {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: '' })
    username: string;

    @Column({ default: '' })
    first_name: string;

    @Column({ default: '' })
    last_name: string;

    @Column({ default: '' })
    password: string;

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @DeleteDateColumn()
    deletedAt: Date
}
