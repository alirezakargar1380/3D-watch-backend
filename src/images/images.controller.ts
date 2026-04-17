import { ImagesService } from './images.service';
import { Body, Controller, Get, HttpException, HttpStatus, Param, Put, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { existsSync, mkdirSync, readFile, unlink, writeFile } from 'fs';
import { diskStorage } from 'multer'
import { FilesInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ProductsService } from 'src/products/products.service';
// const sharp = require('sharp');

const dest: string = 'product-images'

const multer_uploader = diskStorage({
  destination: (req: any, file: any, cb: any) => {
    const uploadPath = './' + dest;
    // Create folder if doesn't exist
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
  // console.log(file)
  if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
    // Allow storage of file
    cb(null, true);
  } else {
    // Reject file
    cb(new HttpException(`Unsupported file type ${extname(file.originalname)}`, HttpStatus.BAD_REQUEST), false);
  }
}

@Controller('images')
export class ImagesController {
  constructor(
    private readonly imageService: ImagesService,
    private readonly productService: ProductsService
  ) { }

  @Put('/upload')
  @UseInterceptors(FilesInterceptor('file', 4, {
    fileFilter: multer_file_filter,
    dest: './' + dest,
    storage: multer_uploader,
  }))
  async single_uploader(@UploadedFiles() files: any, @Body() body: any, @Res() res) {
    try {
      const product = await this.productService.findOne(Number(body.product_id))
      if (!product) return res.status(HttpStatus.METHOD_NOT_ALLOWED).send("this product is not exist")

      if (product.images.length) {
        await this.imageService.deleteAllProductImages(Number(body.product_id))
        for (let i = 0; i < product.images.length; i++) {
          unlink(`${__dirname}/../../${dest}/${product.images[i].name}`, (err) => {
            // console.log(err)
          });
        }
      }

      // const settings: ISettings = await this.settingsService.get()

      // if (files.length > 1) return res.status(HttpStatus.METHOD_NOT_ALLOWED).send("max image num")

      for (let i = 0; i < files.length; i++) {
        const file: any = files[i];

        // read resize from settings
        // sharp(`${file.destination}/${file.filename}`)
        //   .rotate()
        //   .resize(1080)
        //   .toBuffer()
        //   .then((data) => {
        //     writeFile(`${file.destination}/${file.filename}`, data, (err) => { if (err) console.log(err) })
        //   })

        await this.imageService.save({
          name: file.filename,
          product: Number(body.product_id),
          main: (Number(body.main_image) === i) ? true : false,
          hover: (Number(body?.hover_image) === i) ? true : false
        })
      }

      // await this.productService.add_main_pic(body.product_id, createdFiles)

      res.status(HttpStatus.CREATED).send("image was successfuly added to product")
    } catch (e) {
      console.error(e)
    }

  }

  @Put('/main_image')
  async update_main(@Body() body: any, @Res() res) {
    try {
      await this.imageService.noMainImage(body.product_id)
      await this.imageService.setMainImage(body.file_id)
      res.status(HttpStatus.CREATED).send("updated")
    } catch (error) {
      console.error(error)
    }
  }

  // @Put('/uploads')
  // @UseInterceptors(FilesInterceptor('files', 3, {
  //   fileFilter: multer_file_filter,
  //   dest: './' + dest,
  //   storage: multer_uploader,
  // }))
  // async multi_uploader(@UploadedFiles() files: any, @Body() body: any, @Res() res) {
  //   try {
  //     const insertMulti = []
  //     // if (settings.max_number_of_report_image < files.length) return res.status(HttpStatus.METHOD_NOT_ALLOWED).send("max image num")
  //     for (let i = 0; i < files.length; i++) {
  //       const file: any = files[i];

  //       // read resize from settings
  //       sharp(`${file.destination}/${file.filename}`)
  //         .rotate()
  //         .resize(1080)
  //         .toBuffer()
  //         .then((data) => {
  //           writeFile(`${file.destination}/${file.filename}`, data, (err) => { if (err) throw err; })
  //         })

  //       insertMulti.push({ name: file.filename })
  //     }

  //     const createdFiles: any = await this.imageService.insertMulti(insertMulti)


  //     res.status(HttpStatus.CREATED).send(createdFiles)
  //   } catch (e) {
  //     console.error(e)
  //   }
  // }

  @Get('/:imgPath')
  seeUploadedFile(@Param('imgPath') image, @Res() res) {
    try {
      // Check if file exists before sending
      const filePath = `./${dest}/${image}`;
      if (!existsSync(filePath)) {
        return res.status(HttpStatus.NOT_FOUND).send({
          message: 'Image not found'
        });
      }

      // If file exists, send it
      return res.sendFile(image, {
        root: './' + dest
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: 'Error retrieving image',
        error: error.message
      });
    }
  }
}
