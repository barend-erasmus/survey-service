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
import { SurveyRouter } from './routes/survey';

const surveyRepository = new SurveyRepository(config.database.host, config.database.username, config.database.password);

const argv = yargs.argv;
const app = express();

// Configures body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({limit: '50mb'}));

app.post('/api/survey/create', SurveyRouter.create);
app.get('/api/survey/list', SurveyRouter.list);

app.listen(argv.port || 3000, () => {
    console.log(`listening on port ${argv.port || 3000}`);
});
