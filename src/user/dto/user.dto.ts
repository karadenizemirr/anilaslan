import { Work } from "src/work/dto/work.dto";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id:string = uuidv4()

    @Column()
    name: string

    @Column()
    surname: string

    @Column()
    phone_number:string

    @Column()
    email: string

    @Column()
    password: string

    @Column({default: 'user'})
    role: string

    @Column({default: false})
    status: boolean

    @Column()
    identity_no: string
    
    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date

    @OneToMany(() => Work, (work) => work.user, {cascade: true})
    works: Work[]
}