require('ts-mocha');

import { expect, assert } from 'chai';
import * as sinon from 'sinon';
import Author from '../../../../../../apps/common/js/models/Author';

describe('Authors', () => {
    let sandbox: sinon.SinonSandbox;
    let author: Author;
    let originalName = 'name';

    beforeEach(() => {
        author = Author.new(originalName);
        sandbox = sinon.sandbox.create();
    });

    afterEach(() => {
        sandbox.restore();
    })

    describe('.save', () => {
        it('should return a saved Author object with a persistor id', async () => {
            author.setDirty = (transaction: string) => {};

            let amorphicBeginStub: sinon.SinonStub = sandbox.stub(author.amorphic, 'begin').returns('txn');
            let commitStub: sinon.SinonStub = sandbox.stub(author.amorphic, 'commit');
            let setDirtyStub: sinon.SinonStub = sandbox.stub(author, 'setDirty');
            
            try {
                let result = await author.save();
                assert(amorphicBeginStub.called);
                assert(commitStub.called);
                assert(commitStub.calledWith({transaction: 'txn'}));
                assert(setDirtyStub.called);
                assert(result === author)
            }
            catch(err) {
                throw new Error(err);
            }
        });
    });

    describe('.update', () => {
        it('should return an updated Author object with the persistor id and new name', async () => {

            author.setDirty = (transaction: string) => {};
            
            let amorphicBeginStub: sinon.SinonStub = sandbox.stub(author.amorphic, 'begin');
            let commitStub: sinon.SinonStub = sandbox.stub(author.amorphic, 'commit');
            let setDirtyStub: sinon.SinonStub = sandbox.stub(author, 'setDirty');
            
            try {
                let result = await author.update('newName');
                assert(amorphicBeginStub.called);
                assert(commitStub.called);
                assert(setDirtyStub.called);
                expect(author.name).to.equal('newName');
                expect(author.name).to.not.equal(originalName);
            }
            catch(err) {
                throw new Error(err);
            }
        });
    });

    describe('.delete', () => {
        it('persistorDelete should be called and the transaction should be committed', async () => {

            author.persistorDelete = (transaction: string) => {};
            
            let amorphicBeginStub: sinon.SinonStub = sandbox.stub(author.amorphic, 'begin').returns('txn');
            let commitStub: sinon.SinonStub = sandbox.stub(author.amorphic, 'commit');
            let persistorDelete: sinon.SinonStub = sandbox.stub(author, 'persistorDelete');
            
            try {
                let result = await author.delete();
                assert(amorphicBeginStub.called);
                assert(commitStub.called);
                assert(persistorDelete.called);
                assert(commitStub.calledWith({transaction: 'txn'}));
                assert(persistorDelete.calledWith({transaction: 'txn'}));
            }
            catch(err) {
                throw new Error(err);
            }
        });
    });

    describe('.serialize', () => {
        it('should return a JSON that is serialized copy of the author', () => {
            let result = author.serialize();
            
            expect(result).to.deep.equal({ __id__: 'local-Author-6', notes: [], name: originalName });
        });
    });

    describe('.all', () => {
        it('should return an array of author(s)', async () => {

            Author.persistorFetchByQuery = () => {};
            let persistorFetchByQuery: sinon.SinonStub = sandbox.stub(Author, 'persistorFetchByQuery').returns([author]);
            
            try {
                let result = await Author.all();
                assert(persistorFetchByQuery.called);
            }
            catch(err) {
                throw new Error(err);
            }
        });
    });

    describe('.find', () => {
        it('should return an instance of author from the database', async () => {
            Author.persistorFetchById = (id: string) => {};
            let persistorFetchByQuery: sinon.SinonStub = sandbox.stub(Author, 'persistorFetchById').returns(undefined);
            
            try {
                let result = await Author.find('5');
                assert(persistorFetchByQuery.calledWith('5'));
                expect(result).to.be.undefined;
            }
            catch(err) {
                throw new Error(err);
            }
        });
    })

});