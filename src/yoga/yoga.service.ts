import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { YogaPose } from './schema/yoga.schema';
import mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { YogaPoseDto } from './dto/yoga-pose.dto';
import { createOne, deleteOne, updateOne } from 'src/factoryFunction';
import { updateYogaPoseDto } from './dto/yoga-update.dto';

@Injectable()
export class YogaService {
  constructor(
    @InjectModel(YogaPose.name) private yogaModel: mongoose.Model<YogaPose>,
  ) {}

  async getAllYogaPoses(): Promise<YogaPose[]> {
    const yoga = await this.yogaModel.find();
    return yoga;
  }

  async getFilteredYoga(queryParams: any): Promise<YogaPose[]> {
    const filter: any = {};

    if (queryParams.name) {
      // Use $or operator to search in both sanskrit_name and english_name fields
      filter.$or = [
        { sanskrit_name: { $regex: queryParams.name, $options: 'i' } },
        { english_name: { $regex: queryParams.name, $options: 'i' } },
      ];
    }

    if (queryParams.category_name) {
      filter.category_name = queryParams.category_name;
    }

    const yogaPoses = await this.yogaModel.find(filter).exec();
    return yogaPoses;
  }

  async addYogaPose(yogaPoseDto: YogaPoseDto): Promise<string> {
    try {
      await createOne(this.yogaModel, yogaPoseDto);
      return 'Successfully added yoga-pose';
    } catch (error) {
      throw new BadRequestException('Error while creating exercise');
    }
  }
  async deleteYogaPose(id: any): Promise<string> {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) {
      throw new NotAcceptableException('Invalid ID');
    }
    try {
      await deleteOne(this.yogaModel, id);
      return 'Successfully deleted yoga pose';
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new NotFoundException('yoga-pose not found');
      } else {
        throw new BadRequestException(
          'Status Failed!! Error while Delete operation',
        );
      }
    }
  }

  async updateYogaPose(
    id: mongoose.Types.ObjectId,
    updateData: updateYogaPoseDto,
  ): Promise<YogaPose> {
    return await updateOne(this.yogaModel, id, updateData);
  }
}
