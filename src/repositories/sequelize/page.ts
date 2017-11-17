// Imports
import { IPageRepository } from './../page';
import { BaseRepository } from './base';

// Imports models
import { Page } from './../../entities/page';

export class PageRepository extends BaseRepository implements IPageRepository {

    constructor(host: string, username: string, password: string) {
        super(host, username, password);
    }

    public async create(surveyId: number, page: Page): Promise<Page> {
        const result: any = await BaseRepository.models.Pages.create({
            elements: page.elements.map((element) => {
                return {
                    choices: element.choices ? element.choices.map((choice) => {
                        return {
                            order: choice.order,
                            text: choice.text,
                            value: choice.value,
                        };
                    }) : [],
                    description: element.description,
                    maxRateDescription: null,
                    minRateDescription: null,
                    name: element.name,
                    order: element.order,
                    title: element.title,
                    type: element.type,
                };
            }),
            name: page.name,
            order: page.order,
            surveyId: surveyId,
        }, {

                include: [
                    {
                        include: [
                            { model: BaseRepository.models.Choices },
                        ],
                        model: BaseRepository.models.Elements,
                    },
                ],
            });

        page.id = result.id;

        return page;
    }

    public async delete(page: Page): Promise<Page> {
        const result: any = await BaseRepository.models.Pages.find({
            where: {
                id: page.id,
            }
        });

        await result.destroy();

        return page;
    }

    public async update(page: Page): Promise<Page> {
        const existingPage: any = await BaseRepository.models.Pages.find({
            where: {
                id: page.id,
            },
        });

        existingPage.choicesOrder = page.name;
        existingPage.order = page.order;

        await existingPage.save();

        return page;
    }
}
