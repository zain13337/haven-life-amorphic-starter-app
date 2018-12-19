require('ts-mocha');

// external
import { expect, assert } from 'chai';
import * as sinon from 'sinon';
import * as express from 'express';
import * as morgan from 'morgan';
import axios from 'axios';
import { Server } from 'http';

// external
import Author from '../../../../../../apps/common/js/models/Author';
import { authorRouter } from '../../../../../../apps/note/js/routers/authors';

describe('authors routes', () => {
    let sandbox;
    let router: express.Router;
    let author: Author;
    let originalName = 'name';
    let updatedName = 'new name';
    let app: express.Application;
    let server: Server;

    before(() => {
        app = express();
        router = express.Router();
        router.use(morgan('combined', {
            skip: function (req, res) { return res.statusCode < 400 }
        }));
        router.use(express.json());

        authorRouter(router);
        app.use(router);
        server = app.listen(3001);
    });

    after(() => {
        server.close();
    });

    beforeEach(() => {
        author = Author.new(originalName);
        sandbox = sinon.sandbox.create();
    });

    afterEach(() => {
        sandbox.restore();
    })

    describe('.authorRouter', () => {

        it('router setup', () => {
            expect(router.stack.length).to.equal(7);
        });

        it('#post - authors/ should save an author and return author as json', async () => {

            expect(router.stack[2].route).to.exist;
            expect(router.stack[2].route.path).to.equal('/v1/authors/');
            expect(router.stack[2].route.methods).to.deep.equal({ post: true });

            let authorSaveStub: sinon.SinonStub = sandbox.stub(Author.prototype, 'save').returns(author);
            let jsonBlob = { __id__: 'local-Author-23', notes: [], name: 'name' };
            try {
                let result = await axios.post('http://localhost:3001/v1/authors', { name: 'sup' });
                assert.isOk(result, 'The response is ok');
                assert(authorSaveStub.called);
                assert.strictEqual(result.status, 200, 'The response code was 200');
                expect(result.data).to.deep.equal(jsonBlob);
            }
            catch (err) {
                throw new Error(err);
            }

        });

        it('#get - author/ should get all the authors', async () => {
            expect(router.stack[3].route).to.exist;
            expect(router.stack[3].route.path).to.equal('/v1/authors/');
            expect(router.stack[3].route.methods).to.deep.equal({ get: true });

            sandbox.stub(Author, 'all').returns([author]);

            let notesJsonArray = [{ __id__: 'local-Author-25', notes: [], name: originalName }];

            try {
                let result = await axios.get('http://localhost:3001/v1/authors');
                assert.isOk(result, 'The response is ok');
                assert.strictEqual(result.status, 200, 'The response code was 200');
                expect(result.data).to.deep.equal(notesJsonArray);
            }
            catch (err) {
                throw new Error(err);
            }
        });

        it('#get - author/:id should get the specified author', async () => {
            expect(router.stack[4].route).to.exist;
            expect(router.stack[4].route.path).to.equal('/v1/authors/:id');
            expect(router.stack[4].route.methods).to.deep.equal({get: true});

            console.log(author.__id__);

            sandbox.stub(Author, 'find').returns(author);

            let notesJsonObj = { __id__: 'local-Author-26', notes: [], name: originalName };

            try {
                let result = await axios.get('http://localhost:3001/v1/authors/1');
                assert.isOk(result, 'The response is ok');
                assert.strictEqual(result.status, 200, 'The response code was 200');
                expect(result.data).to.deep.equal(notesJsonObj);
            }
            catch (err) {
                throw new Error(err);
            }
        });

        it('#put - author/:id should update the specified author', async () => {
            expect(router.stack[5].route).to.exist;
            expect(router.stack[5].route.path).to.equal('/v1/authors/:id');
            expect(router.stack[5].route.methods).to.deep.equal({put: true});

            let updatedAuthor = author;
            updatedAuthor.name = updatedName;

            sandbox.stub(Author, 'find').returns(author);
            sandbox.stub(Author.prototype, 'update').returns(updatedAuthor);

            let notesJsonObj = { __id__: 'local-Author-27', notes: [], name: updatedName };

            try {
                let result = await axios.put('http://localhost:3001/v1/authors/1', updatedAuthor);
                assert.isOk(result, 'The response is ok');
                assert.strictEqual(result.status, 200, 'The response code was 200');
                expect(result.data).to.deep.equal(notesJsonObj);
            }
            catch (err) {
                throw new Error(err);
            }
        });

        it('#delete - author/:id should delete the specified author', async () => {
            expect(router.stack[6].route).to.exist;
            expect(router.stack[6].route.path).to.equal('/v1/authors/:id');
            expect(router.stack[6].route.methods).to.deep.equal({ delete: true });

            let authorDeleteStub: sinon.SinonStub = sandbox.stub(Author.prototype, 'delete').returns(author);
            let authorFindStub: sinon.SinonStub = sandbox.stub(Author, 'find').returns(author);;

            let jsonBlob = { __id__: 'local-Author-28', notes: [], name: 'name' };
            try {
                let result = await axios.delete(`http://localhost:3001/v1/authors/5`);
                assert.isOk(result, 'The response is ok');
                assert(authorDeleteStub.called);
                assert(authorFindStub.called);
                assert.strictEqual(result.status, 200, 'The response code was 200');
                expect(result.data).to.deep.equal(jsonBlob);
            }
            catch (err) {
                throw new Error(err);
            }
        });
    });
});