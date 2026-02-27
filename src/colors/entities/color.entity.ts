import { Tabs } from "src/tabs/entities/tab.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Colors {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: '' })
    code: string;

    @ManyToOne(() => Tabs)
    @JoinColumn()
    tab: Tabs;
    
    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @DeleteDateColumn()
    deletedAt: Date

}
