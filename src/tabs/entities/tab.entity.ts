
import { Colors } from 'src/colors/entities/color.entity';
import { Products } from 'src/products/entities/product.entity';
import { Entity, Column, JoinColumn, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany } from 'typeorm';

@Entity()
export class Tabs {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Products)
    @JoinColumn()
    product: Products;

    @OneToMany(() => Colors, (color) => color.tab, {
        cascade: true
    })
    colors: Colors[];

    @Column()
    tab_name: string;

    @Column({ default: '' })
    default_color: string;

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
