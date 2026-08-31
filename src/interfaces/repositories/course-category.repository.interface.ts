import type { ICourseCategory } from "../../models/course-category.model";

export interface ICourseCategoryRepository {
  create(
    data: Partial<ICourseCategory>
  ): Promise<ICourseCategory>;

  findById(id: string): Promise<ICourseCategory | null>;

  findByName(name: string): Promise<ICourseCategory | null>;

  findAll(): Promise<ICourseCategory[]>;

  updateById(
    id: string,
    data: Partial<ICourseCategory>
  ): Promise<ICourseCategory | null>;

  deleteById(id: string): Promise<ICourseCategory | null>;

}