import express from 'express';

export class AppRouter {
    private static instance: express.Router;

    static getInstance(): express.Router {
        if (!AppRouter.instance) {
            AppRouter.instance = express.Router();
            console.log('Initialized Router');
        }

        return AppRouter.instance;
    }
}
