import Dexie from 'dexie';
import { IBoard } from './types';

export default class DexieDB extends Dexie {
  public boards: Dexie.Table<IBoard, number>;
  constructor() {
    super('bragment');
    this.version(1).stores({
      boards: '++id, &path, &title, created_at',
    });
    this.boards = this.table('boards');
  }
}
