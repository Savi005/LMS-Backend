import { CourseCategory } from "../models/course-category.model";
import type { ICourseCategory } from "../models/course-category.model";
import type { ICourseCategoryRepository } from "../interfaces/repositories/course-category.repository.interface";

export class CourseCategoryRepository
  implements ICourseCategoryRepository
{
  async create(data: Partial<ICourseCategory>) {
    return CourseCategory.create(data);
  }

  async findById(id: string) {
    return CourseCategory.findById(id);
  }

  async findByName(name: string) {
    return CourseCategory.findOne({ name });
  }

  async findAll() {
    return CourseCategory.find().sort({ name: 1 });
  }

  async updateById(id: string, data: Partial<ICourseCategory>) {
    return CourseCategory.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async deleteById(id: string) {
    return CourseCategory.findByIdAndDelete(id);
  }
}