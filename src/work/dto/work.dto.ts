import { User } from "src/user/dto/user.dto";
import { Column, CreateDateColumn, Entity,  ManyToOne,  PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class Work {
    @PrimaryGeneratedColumn('uuid')
    id:string = uuidv4()

    @Column()
    title: string

    @Column()
    description: string

    @Column()
    from_where: string

    @Column()
    where: string

    @Column()
    airport_number: string

    @Column()
    tour: string

    @Column()
    person: number

    @Column()
    note: string

    @Column()
    price: string

    @Column({default: false})
    isStatus: boolean

    @CreateDateColumn()
    create_at: Date

    @UpdateDateColumn()
    update_at: Date

    @ManyToOne(() => User, (user) => user.works)
    user: User
}