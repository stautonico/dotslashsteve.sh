interface Arg {
    name?: string;
    description?: string;
    required?: boolean;
    default?: string | number | boolean | undefined;
    type?: string;
    long?: string[] | string;
    short?: string[] | string;
    positional?: boolean;
}

export class ArgParser {
    private _name: string; // The name of the program/command
    private _version?: string;
    private _description?: string;
    private _description_long?: string;
    private _args: { [key: string]: Arg } = {};
    private _customHelp: string = '';
    private _customVersion: string = '';
    private _did_parse_args: boolean = false;

    constructor(options: { name: string, version?: string, description?: string, description_long?: string, args?: { [key: string]: Arg } }) {
        this._name = options.name;
        this._version = options.version ?? undefined;
        this._description = options.description ?? undefined;
        this._description_long = options.description_long ?? undefined;
        this._args = options.args ?? {};
    }

    public set_custom_help(help: string) {
        // TODO: Parse help string and add to help
        this._customHelp = help;
    }

    public set_custom_version(version: string) {
        // TODO: Parse version string and add to help
        this._customVersion = version;
    }

    public add_argument(name: string, options: Arg): void {
        /**
         * Add an additional argument to the parser.
         * @param name The name of the argument.
         * @param options The options for the argument.
         */
        // Check if the argument already exists
        if (this._args[name])
            throw new Error(`ArgParser: Argument ${name} already exists`);

        this._args[name] = options;
    }

    public parse(argv: string[] | string) {
        if (this._did_parse_args) {
            // TODO: Maybe just re-parse or just do nothing?
            throw new Error('ArgParser: parse() called twice');
        }
        if (typeof argv === 'string')
            argv = argv.split(' ');


        // TODO: implement
        this._did_parse_args = true;

        return this._args;
    }
}

/*
How to use:
let parser = new ArgParser(options);

Possible options

name: string - The name of the program
description: string - The description of the program
version: string - The version of the program
args: a map of arguments, key is the name of the argument, value is a map of (sub)options

arg sub-options:
name: string - The name of the argument (required)
description: string - The description of the argument (optional)
positional: boolean - Whether the argument is positional or not (optional, default: false)
type: string - The type of the argument (optional, default is string)
default: string - The default value of the argument (optional, default is undefined)
long: string[] - The long names of the argument (optional, default is [--name])
short: string[] - The short names of the argument (optional, default is [])
required: boolean - Whether the argument is required (optional, default is false)

the parser.parse() method returns an object shaped as such:
{
    name: string,
    description: string,
    version: string,
    args: {
        arg1: {
            name: string,
            description: string,
            type: string,
            default: string,
            long: string[],
            short: string[],
            value: {type} (if type != bool),
        },
        arg2: {
        ...
        }
     }
}

some methods:
parser.parse() - parses the arguments and returns an object
parser.getArgument(name) - returns the argument object with the given name
parser.getArgumentValue(name) - returns the value of the argument with the given name
parser.getArgumentCount() - returns the number of arguments
parser.getArgumentNames() - returns an array of the names of all arguments
 */