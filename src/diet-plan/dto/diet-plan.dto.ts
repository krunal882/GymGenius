import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { dietMeal } from './diet-meal.dto';

export class dietPlanDto {
  @IsNotEmpty({ message: 'please provide diet plan name' })
  @IsString({ message: 'diet plan name must be a string' })
  plan_name: string;

  @IsNotEmpty({ message: 'please provide type of diet plan' })
  @IsString({ message: 'diet plan type must be a string' })
  diet_type: string;

  @IsNotEmpty({ message: 'please provide purpose of diet plan' })
  @IsString({ message: 'diet plan purpose must be a string' })
  purpose: string;

  @IsNotEmpty({ message: 'please provide total days of diet plan' })
  @IsNumber({}, { message: 'diet plan total days must be a number' })
  total_days: number;

  @IsNotEmpty({ message: 'please provide total meals of diet plan' })
  @IsArray({ message: 'meal should be an array' })
  meals: dietMeal[];
}
