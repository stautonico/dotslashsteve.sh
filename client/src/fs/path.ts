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
        // If we're absolute, we don't need to do anything
        if (this.path[0] === "/")
            return this;
        else {
            // If we're relative, we need to make it absolute
            // If we have no dots in the path, we can just prepend the current directory
            if (this.path.indexOf(".") === -1)
                return new Path(computer.getcwd() + "/" + this.path);
            else {
                alert("TODO: Implement canonicalize");
                throw new Error("TODO: Implement canonicalize");
            }
        }
    }

    get_path(): string {
        return this.path;
    }

    get_parts(): string[] {
        return this.parts;
    }
}