require('ts-mocha');

import { expect, assert } from 'chai';
import * as sinon from 'sinon';
import Author from '../../../../../apps/common/js/models/Author';

describe('AmorphicSerializer', () => {
    let sandbox;

    let author: Author;
    let originalName = 'name';

    beforeEach(() => {
        author = Author.new(originalName);
        sandbox = sinon.sandbox.create();
    });

    afterEach(() => {
        sandbox.restore();
    })

    describe('.amorphicSerialize', () => {

        it('should serialize an instance of Author properly', () => {
            let result = author.serialize();

            expect(result).to.deep.equal({ __id__: 'local-Author-2', notes: [], name: originalName });
        });
    });
});