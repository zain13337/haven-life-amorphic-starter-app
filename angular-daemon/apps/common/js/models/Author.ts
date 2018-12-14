import { Supertype, supertypeClass, property, Persistable } from 'amorphic';

import AmorphicSerializer from '../AmorphicSerializer';
import Note from './Note';

@supertypeClass
export default class Author extends Persistable(Supertype) {
  @property()
  name: string;

  @property({ type: Array, applicationOmit: true, getType: () => Note })
  notes: Note[] = [];

  constructor() {
    super();
  }

  static new(name: string) {
    return new Author().init(name);
  }

  static async all() {
    try {
      return this.persistorFetchByQuery({});
    }
    catch (e) {
      console.log(e);
    }
  }

  static async find(id: string) {
    try {
      return this.persistorFetchById(id);
    }
    catch (e) {
      console.log(e);
    }
  }

  init(name: string) {
    this.name = name;
    return this;
  }

  public async save() {
    const txn = this.amorphic.begin();
    this.setDirty(txn);
    await this.amorphic.commit({ transaction: txn });
    return this;
  }

  public async update(name: string) {
    this.name = name;
    return await this.save();
  }

  public async delete() {
    const txn = this.amorphic.begin();
    this.persistorDelete({ transaction: txn });
    await this.amorphic.commit({ transaction: txn });
    return this;
  }

  public serialize() {
    return JSON.parse(AmorphicSerializer.amorphicSerialize(this));
  }

}
