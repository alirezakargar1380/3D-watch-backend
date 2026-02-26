
import { Tabs } from 'src/tabs/entities/tab.entity';
import { Entity, Column, JoinColumn, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToOne, ManyToMany, JoinTable, OneToMany } from 'typeorm';

@Entity() 
export class Products {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: '' })
    name: string;

    @Column({ default: '' })
    clock: string;

    @OneToMany(() => Tabs, (tab) => tab.product, {
        cascade: true
    })
    tabs: Tabs[];
    
    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @DeleteDateColumn()
    deletedAt: Date
}
