import { ArgParser } from "../util/argparser";
import { perror, print } from "../util/io";
import { readdir } from "../lib/dirent";

// TODO: Add flags
export const parser = new ArgParser({
  name: "ls",
  description: "list directory contents",
  description_long: "list directory contents",
  version: "0.0.1",
  print_function: print,
  args: {
    "file": {
      description: "the name of the directory to list",
      type: "string",
      required: false,
      positional: true,
    },
    "all": {
      description: "do not ignore entries starting with .",
      type: "boolean",
      required: false,
      short: "a",
      long: "all",
    },
  },
});

export function main(args: string[]): number {
  const parsed = parser.parse(args);

  if (parsed.printed_version_or_help()) {
    return 0;
  }

  let dir = ".";

  if (parsed.has("file")) {
    dir = parsed.get("file");
  }

  let read_result = readdir(dir);

  if (!read_result) {
    perror(`ls: cannot access ${dir}`);
    return 2;
  }

  if (!parsed.get("all")) {
    // Remove all entries that start with '.'
    // @ts-ignore: Checked above
    read_result = read_result.filter((item) => {
      return item[0] !== ".";
    });
  }

  // @ts-ignore: Checked above
  print(read_result.join(" "));

  return 0;
}
