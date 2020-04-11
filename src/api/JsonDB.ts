import fs from 'fs';
import Immutable from 'immutable';
import util from 'util';

const asyncReadFile = util.promisify(fs.readFile);
const asyncWriteFile = util.promisify(fs.writeFile);

export default class JsonDB<T> {
  public static InstanceMap = new Map<string, JsonDB<any>>();
  public afterInitiated?: Promise<Immutable.Record<T>>;
  public defaultValue: T;
  public file: string;
  public idata: Immutable.Record<T>;

  constructor(file: string, defaultValue: T) {
    const db = JsonDB.InstanceMap.get(file);
    this.file = file;
    this.defaultValue = defaultValue;
    this.idata = Immutable.Record(defaultValue)();
    if (db) {
      return db as JsonDB<T>;
    } else {
      JsonDB.InstanceMap.set(file, this);
    }
  }

  public serialize(data: any) {
    return JSON.stringify(data, null, 2);
  }
  public deserialize(json: string) {
    return JSON.parse(json);
  }

  public async read() {
    if (fs.existsSync(this.file)) {
      try {
        const json: string = await asyncReadFile(this.file, 'utf8');
        const data: T = this.deserialize(json);
        this.idata = Immutable.Record(data)();
        return this.idata;
      } catch (err) {
        // EXCEPTION:
      }
    }
    return this.save();
  }

  public async fetch() {
    if (!this.afterInitiated) {
      this.afterInitiated = this.read();
    }
    await this.afterInitiated;
    return this.idata;
  }

  public async update(
    operate: (idata: Immutable.Record<T>) => Immutable.Record<T>
  ) {
    if (!this.afterInitiated) {
      this.afterInitiated = this.read();
    }
    await this.afterInitiated;
    return (this.idata = operate(this.idata));
  }

  public async save() {
    await asyncWriteFile(this.file, this.serialize(this.idata.toObject()));
    return this.idata;
  }

  public async close() {
    JsonDB.InstanceMap.delete(this.file);
  }
}
