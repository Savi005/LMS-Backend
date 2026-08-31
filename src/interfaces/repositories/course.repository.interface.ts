import type { CourseDocument, ICourse } from "../../models/course.model";

export interface ICourseRepository {
  create(data: Partial<ICourse>): Promise<CourseDocument>;

  findById(id: string): Promise<CourseDocument | null>;

  findByTeacherId(teacherId: string): Promise<CourseDocument[]>;

  findPublished(): Promise<CourseDocument[]>;

  findAll(): Promise<CourseDocument[]>;

  updateById(
    id: string,
    data: Partial<ICourse>,
  ): Promise<CourseDocument | null>;

  publish(id:string): Promise<CourseDocument | null>;

  existsByCategoryId(categoryId: string): Promise<boolean>;
}
