import {
    CreateCourseCategoryDto,
    UpdateCourseCategoryDto,
    CourseCategoryResponseDto,
} from "/workspace/lms-backend/src/dtos/course-category.dto";

export interface ICourseCategoryService {
    createCourseCategory(
        data: CreateCourseCategoryDto
    ): Promise<CourseCategoryResponseDto>;
    
    getCourseCategoryById(
        categoryId: string
    ): Promise<CourseCategoryResponseDto>;

    updateCourseCategory(
        categoryId: string,
        data: UpdateCourseCategoryDto
    ): Promise<CourseCategoryResponseDto>;
    
    deleteCourseCategory(
        categoryId: string
    ): Promise<void>;
}