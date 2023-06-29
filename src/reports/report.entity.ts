import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { UserEntity } from '../users/user.entity';


@Entity()
export class Report{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: false})
    approved:boolean;

    @Column()
    price: number;

    @Column()
    company: string;

    @Column()
    model: string;

    @Column()
    mileage: number;

    @Column()
    year: number;

    @Column()
    lat: number;

    @Column()
    lng: number;

    @ManyToOne(() => UserEntity, (user) => user.reports)
    user: UserEntity;
}