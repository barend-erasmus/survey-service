import { Page } from './../entities/page';

export interface IPageRepository {
    create(surveyId: number, page: Page): Promise<Page>;
    delete(page: Page): Promise<Page>;
    update(page: Page): Promise<Page>;
}