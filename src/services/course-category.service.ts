import {
  CourseCategoryResponseDto,
  CreateCourseCategoryDto,
  UpdateCourseCategoryDto,
} from "../dtos/course-category.dto";

import type { ICourseCategoryRepository } from "../interfaces/repositories/course-category.repository.interface";

import { ConflictError } from "../errors/ConflictError";
import { NotFoundError } from "../errors/NotFoundError";
import { CourseCategoryDocument } from "../models/course-category.model";
import { ICourseRepository } from "../interfaces/repositories/course.repository.interface";

export class CourseCategoryService {
  constructor(
    private readonly categoryRepository: ICourseCategoryRepository,
    private readonly courseRepository: ICourseRepository,
  ) {}

  async createCourseCategory(
    data: CreateCourseCategoryDto,
  ): Promise<CourseCategoryResponseDto> {
    const existingCategory = await this.categoryRepository.findByName(
      data.name,
    );

    if (existingCategory) {
      throw new ConflictError(
        "Course category with the same name already exists",
      );
    }
    const category = await this.categoryRepository.create({
      name: data.name,
      description: data.description,
    });
    return this.toResponseDto(category as CourseCategoryDocument);
  }
////////////////////////////check////////////////////////////////////////////////////////////////////////////////////
    async getCourseCategories(): Promise<CourseCategoryResponseDto[]> {
    const categories = await this.categoryRepository.findAll();

    return categories.map((category) =>
      this.toResponseDto(category as CourseCategoryDocument),
    );
  }
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  async updateCategory(
    categoryId: string,
    data: UpdateCourseCategoryDto,
  ): Promise<CourseCategoryResponseDto> {
    const category = await this.categoryRepository.findById(categoryId);

    if (!category) {
      throw new NotFoundError("Course category not found");
    }

    if (data.name) {
      const existingCategory = await this.categoryRepository.findByName(
        data.name,
      );

      if (
        existingCategory &&
        (existingCategory as CourseCategoryDocument)._id.toString() !==
          categoryId
      ) {
        throw new ConflictError("Course category already exists");
      }
    }

    const updatedCategory = await this.categoryRepository.updateById(
      categoryId,
      data,
    );

    if (!updatedCategory) {
      throw new NotFoundError("Course category not found");
    }

    return this.toResponseDto(updatedCategory as CourseCategoryDocument);
  }

  async deleteCategory(categoryId: string): Promise<void> {
    const category = await this.categoryRepository.findById(categoryId);

    if (!category) {
      throw new NotFoundError("Course category not found");
    }

    const isUsed = await this.courseRepository.existsByCategoryId(categoryId);

    if (isUsed) {
      throw new ConflictError(
        "Cannot delete a category that is being used by courses",
      );
    }

    await this.categoryRepository.deleteById(categoryId);
  }

  private toResponseDto(
    category: CourseCategoryDocument,
  ): CourseCategoryResponseDto {
    return {
      id: category._id.toString(),
      name: category.name,
      description: category.description,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }
}
