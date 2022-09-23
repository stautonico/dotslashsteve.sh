import { ArgParser } from "../util/argparser";
import { perror, print } from "../util/io";
import { mkdir } from "../lib/unistd";

// TODO: Add flags
export const parser = new ArgParser({
  name: "mkdir",
  description: "make directories",
  description_long: "",
  version: "0.0.1",
  print_function: print,
  args: {
    "directory": {
      description: "the name of the directory to make",
      type: "string",
      required: true,
      positional: true,
    },
  },
});

export function main(args: string[]): number {
  const parsed = parser.parse(args);

  if (parsed.printed_version_or_help()) {
    return 0;
  }

  let result = mkdir(parsed.get("directory"), 0o775);

  if (!result) {
    perror(`mkdir: cannot create directory '${parsed.get("directory")}'`);
    return 1;
  }

  return 0;
}
