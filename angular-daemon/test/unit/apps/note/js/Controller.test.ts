import { expect, assert } from 'chai';
import * as sinon from 'sinon';
import { Controller } from '../../../../../apps/note/js/Controller';
import {amorphicStatic} from 'amorphic';

// tslint:disable-next-line
require('ts-mocha');

describe('Controller', () => {
    let sandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
    });

    afterEach(() => {
        sandbox.restore();
    })

    describe('.serverInit', () => {
        it('syncAllTables should be called', async () => {
            let controller = new Controller();
            let amorphicStaticStub = sandbox.stub(amorphicStatic, 'syncAllTables');
            try {
                await controller.serverInit();
                assert(amorphicStaticStub.called);
            }
            catch (err) {
                throw new Error(err);
            }
        });
    });
});