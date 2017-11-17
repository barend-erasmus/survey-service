// Imports models
import { Element } from './../entities/element';
import { Response } from './../entities/response';

export class StatisticsService {

    public buildPermutations(lists: Array<any[]>, result: any[], depth: number, current: string): any[] {

        if (depth == lists.length) {
            result.push(current);
            return result;
        }

        for (var i = 0; i < lists[depth].length; ++i) {
            generatePermutations(lists, result, depth + 1, current + lists[depth][i]);
        }

        return result;
    }

    public buildChartsForResponses(responses: Response[]): any[] {

        const result: any[] = [];

        const counts: {} = {};
        const elements: Element[] = [];

        for (const response of responses) {
            for (const answer of response.answers) {

                if (!counts[answer.element.identifier]) {
                    counts[answer.element.identifier] = {};
                    elements.push(answer.element);
                }

                if (!counts[answer.element.identifier][answer.value]) {
                    counts[answer.element.identifier][answer.value] = 1;
                } else {
                    counts[answer.element.identifier][answer.value] += 1;
                }
            }
        }


        for (const element of elements) {
            result.push({
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                title: {
                    text: element.title || element.description || element.name,
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                        }
                    }
                },
                series: [{
                    name: 'Responses',
                    colorByPoint: true,
                    data: Object.keys(counts[element.identifier]).map((key) => {
                        return {
                            name: key,
                            y: counts[element.identifier][key],
                        };
                    }),
                }]
            });
        }

        return result;
    }
}