import { Supertype, supertypeClass, amorphicStatic } from 'amorphic';
import '../../common/js/models';

@supertypeClass
export class Controller extends Supertype {
  // Global properties
  async serverInit() {
    await amorphicStatic.syncAllTables();
  }
}
