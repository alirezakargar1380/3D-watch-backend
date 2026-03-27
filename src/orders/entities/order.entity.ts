import { Customers } from 'src/customers/entities/customer.entity';
import { Products } from 'src/products/entities/product.entity';
import { Entity, Column, JoinColumn, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToOne, ManyToMany, JoinTable, OneToMany } from 'typeorm';

@Entity()
export class Orders {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    colors: string;

    @Column()
    clock: string;

    @ManyToOne(() => Customers)
    @JoinColumn()
    owner: Customers;

    @ManyToOne(() => Products)
    @JoinColumn()
    product: Products;

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @DeleteDateColumn()
    deletedAt: Date
}
