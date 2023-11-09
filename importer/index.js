import { parse } from "csv-parse";
import fs from "node:fs";

async function createTask(task) {
  return fetch("http://localhost:3333/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });
}

async function main() {
  const filePath = new URL("./tasks.csv", import.meta.url);
  const stream = fs.createReadStream(filePath);

  const parser = stream.pipe(
    parse({
      delimiter: ",",
      skipEmptyLines: true,
      fromLine: 2, // skip the header line
    })
  );

  for await (const record of parser) {
    const [title, description] = record;
    await createTask({ title, description });
    console.log("task created", { title, description });
  }
}
main();
