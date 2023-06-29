import { IsString,IsNumber,  Max, Min , IsLongitude, IsLatitude, isString } from "class-validator";
import { Transform } from "class-transformer";

export class GetEstimatedto{
    @IsString()
    company: string;
    
    @IsString()
    model: string;

    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    @Min(1980)
    @Max(2030)
    year: number;

    @Transform(({ value }) => parseFloat(value))
    @IsNumber()
    @Min(2)
    @Max(150)
    mileage: number;

    @Transform(({ value }) => parseFloat(value))
    @IsLongitude()
    lng: number;

    @Transform(({ value }) => parseFloat(value))
    @IsLatitude()
    lat: number;
}