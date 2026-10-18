import { IsBoolean, IsDate, IsOptional, IsString, IsUUID } from 'class-validator';
import { ItemNode } from '../entities/node.entity';

export class CreateNodeDto {
    @IsString()
    name!: string;

    @IsBoolean()
    isFolder!: boolean;

    @IsUUID()
    @IsOptional()
    parentId?: string;
};

export class ResponseNodeDto {
    @IsUUID()
    id!: string;

    @IsString()
    name!: string;

    @IsBoolean()
    isFolder!: boolean;
    
    @IsDate()
    updatedAt!: Date;

    @IsUUID()
    @IsOptional()
    parentId?: string;


    constructor(id: string, name: string, isFolder: boolean, updatedAt: Date, parentId?: string) {
        this.id = id;
        this.name = name;
        this.isFolder = isFolder;
        this.updatedAt = updatedAt;
        this.parentId = parentId;
    }
    static fromEntity(entity: ItemNode): ResponseNodeDto {
        return new ResponseNodeDto(entity.id, entity.name, entity.isFolder, entity.updatedAt, entity.parent?.id);
    }
}
