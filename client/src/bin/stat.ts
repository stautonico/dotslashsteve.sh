import {print} from "../helpers/io";
import {ArgParser} from "../helpers/argparser";
import {stat, ISDIR} from "../lib/sys/stat";

export function main(args: string[]) {
    let parser = new ArgParser({
        name: "stat",
        description: "display file or file system status",
        description_long: "display file or file system status",
        version: "0.0.1",
        print_function: print,
        args: {
            "file": {
                description: "the file to display status for",
                type: "string",
                required: true,
            }
        }
    });

    let parsed = parser.parse(args);

    if (parsed.printed_version_or_help())
        return;

    // Make sure the directory exists
    let stat_result = stat(parsed.get("file"));

    if (stat_result === undefined) {
        print(`cd: ${parsed.get("file")}: No such file or directory`);
        return;
    }

    let output = `File: ${parsed.get("file")}
Size: ${stat_result.size}\tBlocks: 0\tIO Blocks: 0    ${ISDIR(parsed.get("file")) ? "directory" : "regular file"}
Device: ${stat_result.dev}\tInode: ${stat_result.ino}\tLinks: ${stat_result.nlink}
Access: (${(stat_result.mode & 0o777).toString(8)}/TODO: Convert to string)\tUid: (${stat_result.uid}/TODO: Username)\tGid: (${stat_result.gid}/TODO: Group)}
Access: ${stat_result.atime}
Modify: ${stat_result.mtime}
Change: ${stat_result.ctime}
Birth: ${stat_result.crtime}`;

    print(output);
}