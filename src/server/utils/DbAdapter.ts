// DbAdapter.ts
import jsonfile from "jsonfile";
import fs from "node:fs/promises";

type GenericDatabaseEntry = { id: string; [key: string]: unknown };

class DbAdapter {
  async readEntries(path: string) {
    const data = await jsonfile.readFile(path, { encoding: "utf8" });
    return data;
  }

  async appendEntry(path: string, entry: GenericDatabaseEntry) {
    const data: GenericDatabaseEntry[] = await this.readEntries(path);
    jsonfile
      .writeFile(path, [...data, entry], { flag: "w" })
      .then(() => {
        console.log(`Appended new entry to '${path}'`);
      })
      .catch((err) => console.error(err));
  }

  async deleteEntryById(path: string, id: string) {
    const obj = await this.readEntries(path).then(
      (obj: GenericDatabaseEntry[]) => obj.filter((entry) => entry.id !== id),
    );
    jsonfile
      .writeFile(path, obj, { flag: "a" })
      .catch((err) => console.error(err));
  }

  async createFile(path: string): Promise<boolean> {
    try {
      await fs.access(path, fs.constants.R_OK);
      return false;
    } catch {
      await fs.writeFile(path, "[]");
      console.log("File created successfully");
      return true;
    }
  }

  async deleteAllEntries(path: string) {
    jsonfile
      .writeFile(path, [], { flag: "w" })
      .catch((err) => console.error(err));
  }

  async deleteFile(path: string) {
    fs.rm(path);
  }
}

const dbAdapter = new DbAdapter();
export default dbAdapter;
