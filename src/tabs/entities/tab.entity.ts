
import { Products } from 'src/products/entities/product.entity';
import { Entity, Column, JoinColumn, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity()
export class Tabs {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Products)
    @JoinColumn()
    product: Products;

    @Column()
    tab_name: string;

    @Column()
    key: string;

    @Column()
    zoom: number;

    @Column()
    x: number;

    @Column()
    y: number;

    @Column()
    z: number;

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @DeleteDateColumn()
    deletedAt: Date
}
