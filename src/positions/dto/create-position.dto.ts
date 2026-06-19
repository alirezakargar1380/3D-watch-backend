import { IsNumber, IsString } from "class-validator";

export class CreatePositionDto {
    @IsString()
    name: string;

    // @IsString()
    img?: string;

    @IsNumber()
    x: number;

    @IsNumber()
    y: number;


}
