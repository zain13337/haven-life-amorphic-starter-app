require('ts-mocha');

// external
import { expect, assert } from 'chai';
import * as sinon from 'sinon';
import * as express from 'express';
import * as morgan from 'morgan';
import axios from 'axios';
import { Server } from 'http';

// internal
import { notesRouter } from '../../../../../../apps/note/js/routers/notes';
import Note from '../../../../../../apps/common/js/models/Note';
import Author from '../../../../../../apps/common/js/models/Author';

describe('notes routes', () => {
    let sandbox;
    let router: express.Router;
    let note: Note;
    let author: Author;
    let app: express.Application;
    let server: Server;

    before(() => {
        app = express();
        router = express.Router();
        router.use(morgan('combined', {
            skip: function (req, res) { return res.statusCode < 400 }
        }));
        router.use(express.json());

        notesRouter(router);
        app.use(router);
        server = app.listen(3001);
    });

    after(() => {
        server.close();
    });

    beforeEach(() => {
        author = Author.new('noteTest');
        note = Note.new('note title', 'note body', author);
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('.note Router', () => {

        it('router setup', () => {
            expect(router.stack.length).to.equal(7);
        });

        it('#post - notes/ should create a note and return the note as json', async () => {
            expect(router.stack[2].route).to.exist;
            expect(router.stack[2].route.path).to.equal('/v1/notes/');
            expect(router.stack[2].route.methods).to.deep.equal({ post: true });

            Note.prototype.setDirty = (transaction: string) => { };
            sandbox.stub(Note.prototype, 'setDirty');
            sandbox.stub(Note.prototype, 'save').returns(note);

            let noteObj = {
                __id__ :'local-Note-32',
                title:'note title',
                body:'note body',
                author: {
                    __id__:'local-Author-31',
                    notes:[],
                    name: 'noteTest'} };

            try {
                let result = await axios.post('http://localhost:3001/v1/notes', note);
                assert.isOk(result, 'The response is ok');
                assert.strictEqual(result.status, 200, 'The response code was 200');
                expect(result.data).to.deep.equal(noteObj);
            }
            catch (err) {
                throw new Error(err);
            }
        });

        it('#get - notes/ should get all the notes', async () => {
            expect(router.stack[3].route).to.exist;
            expect(router.stack[3].route.path).to.equal('/v1/notes/');
            expect(router.stack[3].route.methods).to.deep.equal({ get: true });

            sandbox.stub(Note, 'all').returns([note]);

            let notesJsonArray = [{
                __id__: 'local-Note-35',
                title: 'note title',
                body: 'note body',
                author: { __id__: 'local-Author-34', notes: [], name: 'noteTest' }
            }];

            try {
                let result = await axios.get('http://localhost:3001/v1/notes');
                assert.isOk(result, 'The response is ok');
                assert.strictEqual(result.status, 200, 'The response code was 200');
                expect(result.data).to.deep.equal(notesJsonArray);
            }
            catch (err) {
                throw new Error(err);
            }
        });

        it('#get - notes/:id should get the specified note', async () => {
            expect(router.stack[4].route).to.exist;
            expect(router.stack[4].route.path).to.equal('/v1/notes/:id');
            expect(router.stack[4].route.methods).to.deep.equal({get: true});

            sandbox.stub(Note, 'find').returns(note);

            let notesJsonObj = { __id__: 'local-Note-37',
                title: 'note title',
                body: 'note body',
                author: { __id__: 'local-Author-36', notes: [], name: 'noteTest' } };

            try {
                let result = await axios.get('http://localhost:3001/v1/notes/1');
                assert.isOk(result, 'The response is ok');
                assert.strictEqual(result.status, 200, 'The response code was 200');
                expect(result.data).to.deep.equal(notesJsonObj);
            }
            catch (err) {
                throw new Error(err);
            }
        });

        it('#put - notes/:id should update the specified note', async () => {
            expect(router.stack[5].route).to.exist;
            expect(router.stack[5].route.path).to.equal('/v1/notes/:id');
            expect(router.stack[5].route.methods).to.deep.equal({put: true});

            let updatedNote = note;
            updatedNote.title = 'new title';

            sandbox.stub(Note, 'find').returns(note);
            sandbox.stub(Note.prototype, 'update').returns(updatedNote);

            let notesJsonObj = { __id__: 'local-Note-39',
                title: 'new title',
                body: 'note body',
                author: { __id__: 'local-Author-38', notes: [], name: 'noteTest' } };

            try {
                let result = await axios.put('http://localhost:3001/v1/notes/1', updatedNote);
                assert.isOk(result, 'The response is ok');
                assert.strictEqual(result.status, 200, 'The response code was 200');
                expect(result.data).to.deep.equal(notesJsonObj);
            }
            catch (err) {
                throw new Error(err);
            }
        });

        it('#delete - notes/:id should delete the specified note', async () => {
            expect(router.stack[6].route).to.exist;
            expect(router.stack[6].route.path).to.equal('/v1/notes/:id');
            expect(router.stack[6].route.methods).to.deep.equal({ delete: true });
            let noteDeleteStub: sinon.SinonStub = sandbox.stub(Note.prototype, 'delete').returns(note);
            let noteFindStub: sinon.SinonStub = sandbox.stub(Note, 'find').returns(note);;

            let jsonBlob = {
                __id__: 'local-Note-41',
                title: 'note title',
                body: 'note body',
                author: { __id__: 'local-Author-40', notes: [], name: 'noteTest' }
            };
            try {
                let result = await axios.delete(`http://localhost:3001/v1/notes/5`);
                assert.isOk(result, 'The response is ok');
                assert(noteDeleteStub.called);
                assert(noteDeleteStub.called);
                assert.strictEqual(result.status, 200, 'The response code was 200');
                expect(result.data).to.deep.equal(jsonBlob);
            }
            catch (err) {
                throw new Error(err);
            }
        });
    });
});