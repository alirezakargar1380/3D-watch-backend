import { Products } from 'src/products/entities/product.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class Images {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({})
    name: string;

    @Column({ default: false })
    main: boolean;

    @ManyToOne(() => Products, {
        onDelete: 'SET NULL',
        nullable: true
    })
    @JoinColumn()
    product: Products

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @DeleteDateColumn()
    deletedAt: Date
}
