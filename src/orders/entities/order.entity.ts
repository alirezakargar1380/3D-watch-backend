import { Address } from 'src/address/entities/address.entity';
import { Cart } from 'src/cart/entities/cart.entity';
import { Customers } from 'src/customers/entities/customer.entity';
import { Products } from 'src/products/entities/product.entity';
import { Entity, Column, JoinColumn, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToOne, ManyToMany, JoinTable, OneToMany } from 'typeorm';

@Entity()
export class Orders {

    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    order_number: string;

    @ManyToOne(() => Customers)
    @JoinColumn()
    owner: Customers;
    
    @ManyToOne(() => Address, {
        onDelete: 'SET NULL'
    })
    @JoinColumn()
    address: Address;

    @OneToMany(() => Cart, (cart) => cart.order)
    products: Cart[];

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @DeleteDateColumn()
    deletedAt: Date
}
