import {computer} from "../helpers/globals";

export class Path {
    private path: string;
    private parts: string[];

    constructor(path: string) {
        this.parts = path.split("/");
        // Remove empty parts
        this.parts = this.parts.filter(part => part !== "");
        this.path = this.parts.length === 0 ? "/" : this.parts.join("/");

        if (path[0] === "/" && this.path[0] !== "/") {
            this.path = "/" + this.path;
        }
    }

    file_name(): string {
        return this.parts.length === 0 ? "" : this.parts[this.parts.length - 1];
    }

    extension(): string {
        const file_name = this.file_name();
        const dot_index = file_name.lastIndexOf(".");
        return dot_index === -1 ? "" : file_name.substring(dot_index + 1);
    }

    parent_name(): string {
        return this.parts.length < 2 ? "" : this.parts[this.parts.length - 2];
    }

    parent_path(): Path {
        return new Path("/" + this.parts.slice(0, this.parts.length - 1).join("/"));
    }

    grandparent_name(): string {
        return this.parts.length < 3 ? "" : this.parts[this.parts.length - 3];
    }

    to_string(): string {
        return this.path;
    }

    canonicalize(): Path {
        let find_result = computer.find(this.path);

        if (find_result.fail())
            throw new Error(`Failed to canonicalize path: ${this.path}`);

        return new Path(find_result.get_data()!.pwd());
    }

    get_path(): string {
        return this.path;
    }

    get_parts(): string[] {
        return this.parts;
    }
}