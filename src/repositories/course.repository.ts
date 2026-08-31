import { Course } from "../models/course.model";
import type { ICourse } from "../models/course.model";
import type { ICourseRepository } from "../interfaces/repositories/course.repository.interface";

export class CourseRepository implements ICourseRepository {
  async create(data: Partial<ICourse>) {
    return Course.create(data);
  }

  async findById(id: string) {
    return Course.findById(id);
  }

  async findByTeacherId(teacherId: string) {
    return Course.find({ teacherId });
  }

  async findPublished() {
    return Course.find({ status: "published" }).sort({ createdAt: -1 });
  }

  async findAll() {
    return Course.find().sort({ createdAt: -1 });
  }

  async updateById(id: string, data: Partial<ICourse>) {
    return Course.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }
  async publish(id: string) {
  return Course.findOneAndUpdate(
    {
      _id: id,
      status: "draft",
    },
    {
      status: "published",
    },
    {
      new: true,
      runValidators: true,
    }
  );
}
  async existsByCategoryId(categoryId: string): Promise<boolean> {
    const course = await Course.exists({
      categoryId,
    });

    return course !== null;
  }
}
