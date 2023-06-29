import { IsString,IsNumber,  Max, Min , IsLongitude, IsLatitude, isString } from "class-validator";

export class CreateReportDto{
    @IsString()
    company: string;
    
    @IsString()
    model: string;

    @IsNumber()
    @Min(1980)
    @Max(2030)
    year: number;

    @IsNumber()
    @Min(2)
    @Max(150)
    mileage: number;

    @IsLongitude()
    lng: number;

    @IsLatitude()
    lat: number;

    @IsNumber()
    @Min(0)
    @Max(15000000)
    price:number;
}