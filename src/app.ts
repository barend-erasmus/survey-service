// Imports
import * as express from 'express';
import * as path from 'path';
import * as request from 'request-promise';
import * as yargs from 'yargs';
import { config } from './config';

// Import Repositories
import { BaseRepository } from './repositories/sequelize/base';
import { SurveyRepository } from './repositories/sequelize/survey';

// Imports middleware
import * as bodyParser from 'body-parser';
import * as exphbs from 'express-handlebars';
import * as cookieSession from 'cookie-session';
import * as passport from 'passport';
import * as OAuth2Strategy from 'passport-oauth2';

// Imports routes
import { UIRouter } from './routes/ui';
import { SurveyRouter } from './routes/survey';


const surveyRepository = new SurveyRepository(config.database.host, config.database.username, config.database.password);

const argv = yargs.argv;
const app = express();

// Configures session
app.use(cookieSession({
    keys: ['my-secret'],
    maxAge: 604800000, // 7 Days
    name: 'session',
}));

// Configures passport
app.use(passport.initialize());

passport.serializeUser((user: any, done: (err: Error, obj: any) => void) => {
    done(null, user.username);
});

passport.deserializeUser((id: string, done: (err: Error, obj: any) => void) => {
    done(null, id);
});

app.use(passport.session());

passport.use(new OAuth2Strategy({
    authorizationURL: 'https://ketone.openservices.co.za/auth/authorize',
    callbackURL: argv.prod ? `https://survey-service.openservices.co.za/ui/callback` : 'http://localhost:3000/ui/callback',
    clientID: '6iqyZJQQ3GX2JWlT4UEz',
    clientSecret: 'EHVqWXe5kCQNPspzSh8m',
    tokenURL: 'https://ketone.openservices.co.za/auth/token',
}, (accessToken: string, refreshToken: string, profile: any, cb) => {
    request({
        headers: {
            authorization: `Bearer ${accessToken}`,
        },
        json: true,
        uri: 'https://ketone.openservices.co.za/auth/user',
    }).then((result: any) => {

        if (result.client_id === '6iqyZJQQ3GX2JWlT4UEz') {
            return cb(null, result);
        } else {
            return cb(new Error('Invalid Client Id'), null);
        }
    }).catch((err: Error) => {
        return cb(err, null);
    });
}));

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
            for (var i = from; i < to + 1; i += incr)
                accum += block.fn(i);
            return accum;
        },
    },
    layoutsDir: path.join(__dirname, 'views/layouts'),
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

app.get('/ui/login', passport.authenticate('oauth2'));

app.get('/ui/callback', passport.authenticate('oauth2', { failureRedirect: '/ui/login' }),
    (req: express.Request, res: express.Response) => {
        res.redirect(decodeURIComponent(req.query.state));
    });

function requireUser(req: express.Request, res: express.Response, next: express.NextFunction) {
    // if (!req.user) {
    //     const options: any = {
    //         state: encodeURIComponent(req.url),
    //     };

    //     passport.authenticate('oauth2', options)(req, res, next);
    //     return;
    // }

    next();
}

app.post('/api/survey/create', requireUser, SurveyRouter.create);
app.put('/api/survey/update', requireUser, SurveyRouter.update);
app.get('/api/survey/list', requireUser, SurveyRouter.list);

app.get('/ui/dashboard', requireUser, UIRouter.dashboard);

app.get('/ui/survey', requireUser, UIRouter.survey);
app.post('/ui/survey', requireUser, UIRouter.surveySubmit);

app.get('/ui/survey/manage', requireUser, UIRouter.surveys);
app.get('/ui/survey/manage/create', requireUser, UIRouter.surveyCreate);
app.get('/ui/survey/manage/edit', requireUser, UIRouter.surveyEdit);

app.listen(argv.port || 3000, () => {
    console.log(`listening on port ${argv.port || 3000}`);
});

// import { Survey } from './entities/survey';
// import { Question } from './entities/question';

// surveyRepository.sync().then(() => {
//     return surveyRepository.create(new Survey(
//         null,
//         'demo-profile-id',
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
//                 'checkbox',
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
//             // new Question(
//             //     null,
//             //     'How likely is it that you would recommend our brand to a friend or colleague?',
//             //     'rating',
//             //     [],
//             //     0,
//             //     10,
//             // ),
//         ],
//     ));
// }).then((result) => {
//     console.log(JSON.stringify(result));
// });
