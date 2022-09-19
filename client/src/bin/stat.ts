import {print} from "../util/io";
import {ArgParser} from "../util/argparser";
import {stat, ISDIR} from "../lib/sys/stat";
import {computer} from "../util/globals";

export const parser = new ArgParser({
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

export function main(args: string[]): number {

    let parsed = parser.parse(args);

    if (parsed.printed_version_or_help())
        return 0;

    // Make sure the directory exists
    let stat_result = stat(parsed.get("file"));

    if (stat_result === undefined) {
        print(`cd: ${parsed.get("file")}: No such file or directory`);
        return 1;
    }

    let username_result = computer.get_user({uid: stat_result.uid});
    let username = username_result?.get_username() || "?";

    let output = `File: ${parsed.get("file")}
Size: ${stat_result.size}\tBlocks: 0\tIO Blocks: 0    ${ISDIR(parsed.get("file")) ? "directory" : "regular file"}
Device: ${stat_result.dev}\tInode: ${stat_result.ino}\tLinks: ${stat_result.nlink}
Access: (${(stat_result.mode & 0o777).toString(8)}/TODO: Convert to string)\tUid: (${stat_result.uid}/${username})\tGid: (${stat_result.gid}/TODO: Group)
Access: ${stat_result.atime}
Modify: ${stat_result.mtime}
Change: ${stat_result.ctime}
Birth: ${stat_result.crtime}`;
    // TODO: Format the Access/modify/change/birth times (2022-01-28 03:28:32.212352072 -0500)
    print(output);

    return 0;
}
