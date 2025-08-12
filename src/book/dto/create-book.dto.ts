import { IsArray, IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateBookDto {
    @IsOptional()
    name?: string;

    @IsNotEmpty({ message: "thumbnail không được để trống" })
    thumbnail: string;

    @IsNotEmpty({ message: "slider không được để trống" })
    @IsArray({ message:"slider phải là mảng"})
    slider: string;

    @IsNotEmpty({ message: "mainText không được để trống" })
    mainText: string;


    @IsNotEmpty({ message: "desc không được để trống" })
    desc: string;
    
    @IsNotEmpty({ message: "author không được để trống" })
    author: string;

    @IsNotEmpty({ message: "price không được để trống" })
    price: string;

    @IsOptional()
    sold?: string;

    @IsNotEmpty({ message: "quantity không được để trống" })
    quantity: string;

    @IsNotEmpty({ message: "quantity không được để trống" })
    @IsMongoId({ each: true, message:"each permission là monggo object id"})
    category: string;
    
}
