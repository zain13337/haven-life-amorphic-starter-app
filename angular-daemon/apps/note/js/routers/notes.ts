import { Request, Response, Router } from 'express';

import Note from '../../../common/js/models/Note';

export function notesRouter(router: Router) {
    const path = '/v1/notes';

    router.post(`${path}/`, async (req: Request, res: Response) => {
            const { title, body, author } = req.body as Note;
            let note = Note.new(title, body, author);
            note = await note.save();
            return res.json(note.serialize());
        })
        // READ:
        .get(`${path}/`, async (req: Request, res: Response) => {
            const notes: Note[] = await Note.all();
            const serializedNotes: object[] = notes.map( (note) => note.serialize());
            return res.json(serializedNotes);
        })
        .get(`${path}/:id`, async (req: Request, res: Response) => {
            const id: string = req.params.id;
            const note: Note = await Note.find(id);
            return res.json(note.serialize());
        })
        // UPDATE:
        .put(`${path}/:id`, async (req: Request, res: Response) => {
            const id: string = req.params.id;
            const { title, body, author } = req.body as Note;
            let note: Note = await Note.find(id);
            note = await note.update(title, body, author);
            return res.json(note.serialize());
        })
        // DESTROY:
        .delete(`${path}/:id`, async (req: Request, res: Response) => {
            const id: string = req.params.id;
            let note: Note = await Note.find(id);
            note = await note.delete();
            return res.json(note.serialize());
        });
}
