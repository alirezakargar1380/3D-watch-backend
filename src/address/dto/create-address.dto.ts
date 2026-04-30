import { IsNotEmpty, IsNumber, NotEquals } from "class-validator";

export class CreateAddressDto {
    // @IsNumber()
    // // @IsNotEmpty()
    // @NotEquals(0)
    id: number

    customer: any
}
