import fs, { createReadStream, createWriteStream } from "fs";
import csv from "csv-parser";
import { Parser, parse } from "json2csv";

import * as models from "../models";

const FILENAME = process.cwd() + "/src/data.csv";
const FIELDS = ["first_name", "last_name", "email", "password"];

export interface User {
  // id: string;
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  department: string;
  password: string;
  created_at: string;
}

//read data set from CSV file
export const fetchData = async (): Promise<User[]> => {
  return new Promise(function (resolve, reject) {
    const result: User[] = [];
    fs.createReadStream(FILENAME)
      .pipe(csv())
      .on("data", (data) => result.push(data))
      .on("end", async () => {
        resolve(result);
      });
  });
};

export const write = async (data: User) => {
  let rows = parse(data, { header: false });
  const newLine = "\r\n";

  fs.appendFileSync(FILENAME, newLine);
  fs.appendFileSync(FILENAME, rows);
};

export const mutateFile = async (data: User[]) => {
  try {
    const fields = ["first_name", "last_name", "email", "password"];
    const opts = { fields };

    const parser = new Parser(opts);
    const csv = parser.parse(data);
    let writestream = fs.createWriteStream(FILENAME);
    writestream.write(csv);

    writestream.on("finish", () => {
      console.log("file has been completely written");
    });

    writestream.end();
  } catch (err) {
    throw new Error(err);
  }
};
