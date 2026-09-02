import { Types } from "mongoose";
import { Lesson, ILesson } from "../models/lesson.model";
import {
  CreateLessonDto,
  UpdateLessonDto,
} from "../dtos/lesson.dto";
import { ILessonRepository } from "../interfaces/repositories/lesson.repository.interface";

export class LessonRepository implements ILessonRepository {
  async create(
    data: CreateLessonDto & {
      courseId: Types.ObjectId;
      order: number;
    },
  ): Promise<ILesson> {
    return Lesson.create(data);
  }

  async findById(
    lessonId: string,
  ): Promise<ILesson | null> {
    return Lesson.findById(lessonId);
  }

  async findByCourseId(
    courseId: string,
  ): Promise<ILesson[]> {
    return Lesson.find({
      courseId: new Types.ObjectId(courseId),
    }).sort({ order: 1 });
  }

  async update(
    lessonId: string,
    data: UpdateLessonDto,
  ): Promise<ILesson | null> {
    return Lesson.findByIdAndUpdate(
      lessonId,
      { $set: data },
      {
        new: true,
        runValidators: true,
      },
    );
  }

  async delete(
    lessonId: string,
  ): Promise<ILesson | null> {
    return Lesson.findByIdAndDelete(lessonId);
  }

  async getMaxOrder(
    courseId: string,
  ): Promise<number> {
    const lesson = await Lesson.findOne({
      courseId: new Types.ObjectId(courseId),
    })
      .sort({ order: -1 })
      .select({ order: 1 })
      .lean();

    return lesson?.order ?? 0;
  }

  async existsByCourseIdAndOrder(
    courseId: string,
    order: number,
  ): Promise<boolean> {
    const lesson = await Lesson.exists({
      courseId: new Types.ObjectId(courseId),
      order,
    });

    return Boolean(lesson);
  }
}