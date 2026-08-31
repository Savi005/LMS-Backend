import type { Request, Response } from "express";

import type { CourseCategoryService } from "../services/course-category.service";

export class CourseCategoryController {
    constructor(
        private readonly categoryService: CourseCategoryService,
    ) {}

    createCategory = async (req: Request, res: Response) => {
        const category = await this.categoryService.createCourseCategory(req.body);

        return res.status(201).json({
            success: true,
            data: category,
        });
    };

    getCategories = async (_req: Request, res: Response) => {
        const categories = await this.categoryService.getCourseCategories();

        return res.status(200).json({
            success: true,
            data: categories,
        });
    };

    updateCategory = async (req: Request, res: Response) => {
        const category = await this.categoryService.updateCategory(
            req.params.categoryId as string,
            req.body,
        );

        return res.status(200).json({
            success: true,
            data: category,
        });
    };

    deleteCategory = async (req: Request, res: Response) => {
        await this.categoryService.deleteCategory(req.params.categoryId as string);

        return res.status(204).send();
    };
}