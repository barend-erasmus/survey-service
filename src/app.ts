// Imports
import * as express from 'express';
import * as path from 'path';
import * as yargs from 'yargs';
import { config } from './config';

// Import Repositories
import { BaseRepository } from './repositories/sequelize/base';
import { SurveyRepository } from './repositories/sequelize/survey';

// Imports middleware
import * as bodyParser from 'body-parser';

// Imports routes
import { UIRouter } from './routes/ui';
import { SurveyRouter } from './routes/survey';
import * as exphbs from 'express-handlebars';

const surveyRepository = new SurveyRepository(config.database.host, config.database.username, config.database.password);

const argv = yargs.argv;
const app = express();

// Configures body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '50mb' }));

app.use('/static', express.static(path.join(__dirname, 'public')));

// Configures view engine
app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    helpers: {
        'ifCond': (v1: any, v2: any, options) => {
            if (v1 === v2) {
                return options.fn(this);
            }
            return options.inverse(this);
        },
        'for': (from: number, to: number, incr: number, block: any) => {
            var accum = '';
            for(var i = from; i < to + 1; i += incr)
                accum += block.fn(i);
            return accum;
        },
    },
    layoutsDir: path.join(__dirname, 'views/layouts'),
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

app.post('/api/survey/create', SurveyRouter.create);
app.get('/api/survey/list', SurveyRouter.list);

app.get('/ui/surveys', UIRouter.surveys);
app.get('/ui/survey', UIRouter.survey);
app.post('/ui/survey', UIRouter.surveySubmit);
app.get('/ui/survey/manage/create', UIRouter.surveyCreate);

app.listen(argv.port || 3000, () => {
    console.log(`listening on port ${argv.port || 3000}`);
});

// import { Survey } from './entities/survey';
// import { Question } from './entities/question';

// surveyRepository.sync().then(() => {
//     return surveyRepository.create('demo-profile-id', new Survey(
//         null,
//         'Brand Awareness',
//         [
//             new Question(
//                 null,
//                 'When was the last time you used this product category?',
//                 'multiple-choice',
//                 [
//                     'In the last week',
//                     'In the last month',
//                     'In the last 3 months',
//                     'In the last 6 months',
//                     'In the last 12 months',
//                     'More than 12 months ago',
//                     'Never',
//                 ],
//                 null,
//                 null,
//             ),
//             new Question(
//                 null,
//                 'When you think of this product type, what brands come to mind?',
//                 'text',
//                 [],
//                 null,
//                 null,
//             ),
//             new Question(
//                 null,
//                 'Which of the following brands have you heard of? (Select all that apply)',
//                 'checkboxes',
//                 [
//                     'Competitor 1',
//                     'Competitor 2',
//                     'Competitor 3',
//                     'Competitor 4',
//                     'Competitor 5',
//                     'Competitor 6',
//                 ],
//                 null,
//                 null,
//             ),
//             new Question(
//                 null,
//                 'When did you first hear about our brand?',
//                 'multiple-choice',
//                 [
//                     'In the last month',
//                     'In the last 6 months',
//                     'In the last 12 months',
//                     'In the last 3 years',
//                     'More than 3 years ago',
//                     'I’ve never heard of it',
//                 ],
//                 null,
//                 null,
//             ),
//             new Question(
//                 null,
//                 'How likely is it that you would recommend our brand to a friend or colleague?',
//                 'rating',
//                 [],
//                 0,
//                 10,
//             ),
//         ],
//     ));
// }).then((result) => {
//     console.log(JSON.stringify(result));
// });
