import { Expose, Transform} from 'class-transformer';
import { UserEntity } from '../../users/user.entity';

export class ReportDto{
    @Expose()
    id: number;

    @Expose()
    price: number;

    @Expose()
    year: number;

    @Expose()
    lng: number;

    @Expose()
    lat: number;

    @Expose()
    company: string;

    @Expose()
    model: string;

    @Expose()
    mileage: number;

    @Expose()
    approved: boolean;

    @Transform(({ obj}) => obj.user.id)
    @Expose()
    userId: number;

}