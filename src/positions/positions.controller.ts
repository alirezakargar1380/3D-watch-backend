import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpException, UseInterceptors, UploadedFile, Res } from '@nestjs/common';
import { PositionsService } from './positions.service';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';

import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer'
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Express, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express'

const dest: string = './public/cover-type-icons'

const multer_uploader = diskStorage({
  destination: (req: any, file: any, cb: any) => {
    const uploadPath = dest;
    // Create folder if doesn't exist
    if (!existsSync('./public')) {
      mkdirSync('./public');
    }
    if (!existsSync(uploadPath)) {
      mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  // File modification details
  filename: (req: any, file: any, cb: any) => {
    const fileName: string = `${new Date().toDateString().toString() + "_" + uuidv4() + extname(file.originalname)}`;
    // Calling the callback passing the random name generated with the original extension name
    cb(null, fileName);
  },
})

const multer_file_filter = (req: any, file: any, cb: any) => {
  if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
    // Allow storage of file
    cb(null, true);
  } else {
    // Reject file
    cb(new HttpException(`Unsupported file type ${extname(file.originalname)}`, HttpStatus.BAD_REQUEST), false);
  }
}


@Controller('positions')
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) { }

  @Post()
  create(@Body() createPositionDto: CreatePositionDto) {
    return this.positionsService.create(createPositionDto);
  }

  @Get('/:name/icon')
  get_icon_image(@Param('name') image: string, @Res() res: Response) {
    try {
      if (image == 'null') {
        throw new Error('No image found')
      }
      res.sendFile(image, {
        root: dest
      })
    } catch (error) {

    }
  }

  @Patch('/:id/icon')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: multer_file_filter,
    dest: './' + dest,
    storage: multer_uploader,
  }))
  async update_icon(@Param('id') id: string, @UploadedFile() file: any, @Res() res: Response) {
    await this.positionsService.update(+id, { img: file.filename });

    res.status(HttpStatus.OK).send(
      await this.positionsService.findOne(+id)
    )
    // return await this.productsCoverTypesService.findOne(+id);
  }

  @Get()
  findAll() {
    return this.positionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.positionsService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePositionDto: UpdatePositionDto, @Res() res: Response) {
    await this.positionsService.update(+id, updatePositionDto);
    res.status(HttpStatus.OK).send(
      await this.positionsService.findOne(+id)
    )
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.positionsService.remove(+id);
  }
}
