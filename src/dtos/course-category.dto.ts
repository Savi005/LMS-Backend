export interface CreateCourseCategoryDto {
  name: string;
  description?: string;
}

export interface UpdateCourseCategoryDto {
  name?: string;
  description?: string;
}

export interface CourseCategoryResponseDto {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}