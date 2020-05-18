import { Supertype, supertypeClass, property, Persistable } from 'amorphic';

import AmorphicSerializer from '../AmorphicSerializer';
import Author from './Author';

@supertypeClass
export default class Note extends Persistable(Supertype) {

  @property()
  title: string;

  @property({
    isRemoteObject: true,
    remoteKeyBase: 'document-doc-key'
  })
  body: string;

  @property({ getType: () => Author })
  author: Author;

  constructor() {
    super();
  }

  static new(title: string, body: string, author: Author) {
    return new Note().init(title, body, author);
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

  init(title: string, body: string, author: Author) {
    this.set(title, body, author);
    return this;
  }

  private set(title: string, body: string, author: Author) {
    this.title = title;
    this.body = body;
    this.author = author;
  }

  public async save() {
    const txn = this.amorphic.begin();
    this.persistorSave({ transaction: txn });
    await this.amorphic.commit({ transaction: txn });
    return this;
  }

  public async update(title: string, body: string, author: Author) {
    this.set(title, body, author);
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
