require('ts-mocha');


import { expect, assert } from 'chai';
import * as sinon from 'sinon';
import Author from '../../../../../../apps/common/js/models/Author';
import Note from '../../../../../../apps/common/js/models/Note';

describe('Notes', () => {
    let sandbox: sinon.SinonSandbox;
    let author: Author;
    let note: Note;
    let originalName = 'name';
    let originalTitle = 'title';
    let originalBody = 'body';

    beforeEach(() => {
        author = Author.new(originalName);
        note = Note.new(originalTitle, originalBody, author);
        sandbox = sinon.sandbox.create();
    });

    afterEach(() => {
        sandbox.restore();
    })

    describe('.save', () => {
        it('should return a saved note object with a persistor id', async () => {
            note.persistorSave = ({ transaction: any }) => {};

            let amorphicBeginStub: sinon.SinonStub = sandbox.stub(note.amorphic, 'begin').returns('txn');
            let commitStub: sinon.SinonStub = sandbox.stub(note.amorphic, 'commit');
            let persistorSaveStub: sinon.SinonStub = sandbox.stub(note, 'persistorSave');

            try {
                let result = await note.save();
                assert(amorphicBeginStub.called);
                assert(commitStub.called);
                assert(commitStub.calledWith({ transaction: 'txn' }));
                assert(persistorSaveStub.called);
                assert(result === note);
            }
            catch (err) {
                throw new Error(err);
            }
        });
    });

    describe('.update', () => {
        it('should return an updated note object with the persistor id and new name', async () => {

            note.persistorSave = (transaction: any) => { };

            let amorphicBeginStub: sinon.SinonStub = sandbox.stub(note.amorphic, 'begin');
            let commitStub: sinon.SinonStub = sandbox.stub(note.amorphic, 'commit');
            let persistorSaveStub: sinon.SinonStub = sandbox.stub(note, 'persistorSave');

            try {
                let result = await note.update('newName', 'bodyString', author);
                assert(amorphicBeginStub.called);
                assert(commitStub.called);
                assert(persistorSaveStub.called);
                expect(note.title).to.equal('newName');
                expect(note.body).to.equal('bodyString');
            }
            catch (err) {
                throw new Error(err);
            }
        });
    });

    describe('.delete', () => {
        it('persistorDelete should be called and the transaction should be committed', async () => {

            note.persistorDelete = (transaction: string) => { };

            let amorphicBeginStub: sinon.SinonStub = sandbox.stub(note.amorphic, 'begin').returns('txn');
            let commitStub: sinon.SinonStub = sandbox.stub(note.amorphic, 'commit');
            let persistorDelete: sinon.SinonStub = sandbox.stub(note, 'persistorDelete');

            try {
                let result = await note.delete();
                assert(amorphicBeginStub.called);
                assert(commitStub.called);
                assert(persistorDelete.called);
                assert(commitStub.calledWith({ transaction: 'txn' }));
                assert(persistorDelete.calledWith({ transaction: 'txn' }));
            }
            catch (err) {
                throw new Error(err);
            }
        });
    });

    describe('.serialize', () => {
        it('should return a JSON that is serialized copy of the note', () => {
            let result = note.serialize();
            let expected = {
                __id__: 'local-Note-16',
                title: 'title',
                body: 'body',
                author: { __id__: 'local-Author-15', notes: [], name: 'name' }
            };

            expect(result).to.deep.equal(expected);
        });
    });

    describe('.all', () => {
        it('should return an array of notes or an empty array', async () => {

            Note.persistorFetchByQuery = () => { };
            let persistorFetchByQuery: sinon.SinonStub = sandbox.stub(Note, 'persistorFetchByQuery').returns([note]);

            try {
                let result = await Note.all();
                assert(persistorFetchByQuery.called);
            }
            catch (err) {
                throw new Error(err);
            }
        });
    });

    describe('.find', () => {
        it('should return an instance of note from the database', async () => {
            Note.persistorFetchById = (id: string) => { };
            let persistorFetchByQuery: sinon.SinonStub = sandbox.stub(Note, 'persistorFetchById').returns(undefined);

            try {
                let result = await Note.find('5');
                assert(persistorFetchByQuery.calledWith('5'));
                expect(result).to.be.undefined;
            }
            catch (err) {
                throw new Error(err);
            }
        });
    })

});