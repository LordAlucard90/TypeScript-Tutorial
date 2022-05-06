import bodyParser from 'body-parser';
import cookieSession from 'cookie-session';
import express  from 'express';
import { AppRouter } from './AppRouter';
import './controllers/LoginController'; // this makes the routes load
import './controllers/RootController'; // this makes the routes load

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({keys: ['encodingKey']}))
app.use(AppRouter.getInstance())

app.listen(3000, () => {
    console.log('Listening on port 3000.');
});
