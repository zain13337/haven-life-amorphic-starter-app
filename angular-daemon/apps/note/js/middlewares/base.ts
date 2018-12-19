import * as express from 'express';
import * as morgan from 'morgan';

export function baseHandler(router: express.Router) {
    router.use(morgan('combined'));
    router.use(express.json());
}
