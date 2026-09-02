    export interface CreateLessonDto {
        title: string;
        description?: string;
        content: string;
        order?: number;
        }

export interface UpdateLessonDto {
    title?: string;
    description?: string;
    content?: string;
}

export interface ResponseLessonDto {
    id: string;
    title: string;
    description?: string;
    content: string;
    courseId: string;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}