import { Request, Response, Router } from 'express';
import Author from '../../../common/js/models/Author';

export function authorRouter(router: Router) {
    const path = '/v1/authors';
    router.post(`${path}/`, async (req: Request, res: Response) => {
        const { name } = req.body as Author;
        let author = Author.new(name);
        author = await author.save();
        return res.json(author.serialize());
    })
        // READ:
    .get(`${path}/`, async (req: Request, res: Response) => {
        const authors: Author[] = await Author.all();
        const serializedAuthors: object[] = authors.map( (author) => author.serialize());
        return res.json(serializedAuthors);
    })
    .get(`${path}/:id`, async (req: Request, res: Response) => {
        const id: string = req.params.id;
        const author: Author = await Author.find(id);
        return res.json(author.serialize());
    })
        // UPDATE:
    .put(`${path}/:id`, async (req: Request, res: Response) => {
        const id: string = req.params.id;
        const { name } = req.body as Author;
        let author: Author = await Author.find(id);
        author = await author.update(name);
        return res.json(author.serialize());
    })
        // DESTROY:
    .delete(`${path}/:id`, async (req: Request, res: Response) => {
        const id: string = req.params.id;
        let author: Author = await Author.find(id);
        author = await author.delete();
        return res.json(author.serialize());
    });
}
