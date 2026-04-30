import { Customers } from 'src/customers/entities/customer.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class Address {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Customers, {
        onDelete: 'SET NULL'
    })
    @JoinColumn()
    customer: Customers

    @Column()
    name: string;

    @Column()
    city: string;

    @Column()
    state: string;

    @Column()
    post_code: string;

    @Column()
    phone: string;

    @Column()
    address: string;

    @Column({default: false})
    primary: boolean;

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @DeleteDateColumn()
    deletedAt: Date
}
