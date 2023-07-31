import { Column, Entity, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { v4 as uuidv4 } from 'uuid';
import { Work } from "./work.dto";
import { User } from "src/user/dto/user.dto";

@Entity()
export class Apporoved {
    @PrimaryGeneratedColumn('uuid')
    id: string = uuidv4()

    @Column({default: false})
    status: boolean

    @ManyToOne(() => Work, (work) => work.apporoveds)
    work: Work

    @ManyToOne(() => User, (user) => user.apporoveds)
    user: User

}