import { ArgParser } from "../util/argparser";
import { print } from "../util/io";
import { read } from "../lib/unistd";

export const parser = new ArgParser({
  name: "man",
  description: "an interface to the system reference manuals",
  description_long: "an interface to the system reference manuals",
  version: "0.0.1",
  print_function: print,
  args: {
    "page": {
      description: "the name of the manual page to display",
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

  let read_result = read(`/usr/share/man/${parsed.get("page")}`);

  if (read_result) {
    print(read_result, { escape_html: false });
    return 0;
  }

  print(`No manual entry for ${parsed.get("page")}`);
  return 16;
}
