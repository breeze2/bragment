import Dexie from 'dexie';
import { IBoard } from './types';

export class Database extends Dexie {
  public boards: Dexie.Table<IBoard, number>;
  constructor() {
    super('bragment');
    this.version(1).stores({
      boards: '++id, &path, &title, created_at',
    });
    this.boards = this.table('boards');
  }
}

const db = new Database();
export default db;
