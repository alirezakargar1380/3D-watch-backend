import { Positions } from 'src/positions/entities/position.entity';
import { Products } from 'src/products/entities/product.entity';
import { Entity, Column, JoinColumn, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToOne, ManyToMany, JoinTable, OneToMany } from 'typeorm';

@Entity()
export class ProductPositions {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Products, {
        orphanedRowAction: 'delete'
    })
    @JoinColumn()
    product: Products;

    @ManyToOne(() => Positions, (color) => color.id, {
        // onDelete: 'SET NULL',
        // orphanedRowAction: 'delete',
        // nullable: true
    })
    @JoinColumn()
    position: Positions;

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @DeleteDateColumn()
    deletedAt: Date
}
