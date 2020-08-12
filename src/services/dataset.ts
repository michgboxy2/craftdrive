import fs from "fs";
import csv from "csv-parser";
import { Parser, parse } from "json2csv";

import { User } from "../services/types";

const isTest = !!process.env.TEST_FILE;

let FILENAME: string;

if (isTest) {
  FILENAME = process.cwd() + "/src/test_data.csv";
} else {
  FILENAME = process.cwd() + "/src/data.csv";
}

const fields = ["first_name", "last_name", "email", "password"];

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
  let rows;
  const opts = { fields };
  const parser = new Parser(opts);
  if (!fs.existsSync(FILENAME)) {
    rows = parser.parse(data);
  } else {
    rows = parse(data, { header: false });
  }

  const newLine = "\r\n";

  fs.appendFileSync(FILENAME, newLine);
  fs.appendFileSync(FILENAME, rows);
};

export const mutateFile = async (data: User[]) => {
  try {
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
