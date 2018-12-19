require('ts-mocha');

import { expect, assert } from 'chai';
import * as sinon from 'sinon';
import * as express from 'express';
import {baseHandler} from '../../../../../../apps/note/js/middlewares/base';

describe('base middleware', () => {
    let sandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
    });

    afterEach(() => {
        sandbox.restore();
    })

    describe('.baseHandler', () => {

        it('should create a new router, and register middlewares', () => {
            let router = express.Router();
            baseHandler(router);

            expect(router.stack.length).to.equal(2);
            expect(router.stack[0].name).to.equal('logger'); // morgan logger
            expect(router.stack[1].name).to.equal('jsonParser'); // bodyParser
        });
    });
});