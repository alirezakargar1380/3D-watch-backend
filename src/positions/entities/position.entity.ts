import { Products } from 'src/products/entities/product.entity';
import { Entity, Column, JoinColumn, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToOne, ManyToMany, JoinTable, OneToMany } from 'typeorm';

@Entity()
export class Positions {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({
        default: ''
    })
    img: string;

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @DeleteDateColumn()
    deletedAt: Date
}
