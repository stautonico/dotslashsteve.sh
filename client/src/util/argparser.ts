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

interface ArgParserOptions {
    name: string,
    version?: string,
    description?: string,
    description_long?: string,
    args?: { [key: string]: Arg },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    print_function?: (...args: any[]) => void,
}

export class ArgParser {
    private readonly _name: string; // The name of the program/command
    private readonly _version?: string;
    private _description?: string;
    private _description_long?: string;
    private readonly _args: Map<string, Arg>;
    private _help_string = "";
    private _version_string = "";
    private _did_parse_args = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private readonly _custom_console_log: (...args: any[]) => void;
    private _positional_arg_counter = 0;

    constructor(options: ArgParserOptions) {
        this._name = options.name;
        this._version = options.version ?? undefined;
        this._description = options.description ?? undefined;
        this._description_long = options.description_long ?? undefined;
        this._args = new Map();

        // Validate each of the args and add to the map
        for (let key in options.args) {
            let arg = options.args[key];
            if (arg.name === undefined)
                arg.name = key;

            // If we don't have a type, and it's not a positional, we'll assume it's a boolean
            if (!arg.type && !arg.positional)
                arg.type = "boolean";

            // If we don't have a type, and it's a positional, we'll assume it's a string
            if (!arg.type && arg.positional)
                arg.type = "string";

            // If positional wasn't set, but we have a long/short, we'll assume it's a flag
            if (arg.positional === undefined && (arg.long || arg.short))
                arg.positional = false;

            // If positional was set, and we have a long/short, it's an error
            if (arg.positional && (arg.long || arg.short))
                throw new Error(`ArgParser: Argument ${key} cannot both be a flag and positional`);

            // If positional wasn't set, and we don't have a long/short, let's assume it's a positional
            if (arg.positional === undefined && !(arg.long || arg.short))
                arg.positional = true;

            // If positional was set to false, and we don't have a long/short, it's an error
            if (arg.positional === false && !(arg.long || arg.short))
                throw new Error(`ArgParser: Argument ${key} must be a flag or positional`);

            // Validate our default's type against our type
            if (arg.default && arg.type) {
                if (typeof arg.default !== arg.type)
                    throw new Error(`ArgParser: Argument ${key} default type ${typeof arg.default} does not match type ${arg.type}`);
            }

            // If our type is boolean, and we don't have a default, we'll assume it's false
            if (arg.type === "boolean" && !arg.default)
                arg.default = false;

            // If required wasn't set, we'll assume it's false
            if (arg.required === undefined)
                arg.required = false;

            // Add the argument to the map
            this._args.set(arg.name, arg);
        }

        this._custom_console_log = options.print_function ?? console.log;
    }

    private reset() {
        this._did_parse_args = false;
        this._positional_arg_counter = 0;
    }

    private generate_help(): void {
        if (this._help_string === undefined || this._help_string === "") {
            this._help_string = `Usage: ${this._name}`;
            for (let [name, arg] of this._args) {
                if (arg.positional) {
                    this._help_string += ` ${name}`;
                } else {
                    if (arg.long) {
                        if (typeof arg.long === "string") {
                            this._help_string += ` [--${arg.long}]`;
                        } else if (Array.isArray(arg.long)) {
                            this._help_string += ` [--${arg.long.join("|--")}]`;
                        }
                    }
                    if (arg.short) {
                        if (typeof arg.short === "string") {
                            this._help_string += ` [-${arg.short}]`;
                        } else if (Array.isArray(arg.short)) {
                            this._help_string += ` [-${arg.short.join("|-")}]`;
                        }
                    }
                }
            }
        }
    }

    private generate_version(): void {
        if (this._version_string === undefined || this._version_string === "")
            this._version_string = `${this._name} v${this._version}`;
    }

    public set_custom_help(help: string) {
        // TODO: Parse help string and add to help
        this._help_string = help;
    }

    public set_custom_version(version: string) {
        // TODO: Parse version string and add to help
        this._version_string = version;
    }

    public add_argument(name: string, options: Arg): void {
        /**
         * Add an additional argument to the parser.
         * @param name The name of the argument.
         * @param options The options for the argument.
         */
        // Check if the argument already exists
        if (this._args.get(name))
            throw new Error(`ArgParser: Argument ${name} already exists`);

        this._args.set(name, options);
    }

    public generate_manual(): string {
        let NAME = `<b>NAME</b>\n\t${this._name} - ${this._description}`;
        let SYNOPSIS = `<b>SYNOPSIS</b>\n\t${this._name} [OPTION]... `;
        let DESCRIPTION = `<b>DESCRIPTION</b>\n\t${this._description_long}\n\n`;

        for (let arg of this._args) {
            let arg_name = arg[0];
            let arg_obj = arg[1];
            if (arg_obj.positional) {
                // TODO: Implement positional arguments that can take one or more values (+)
                if (arg_obj.required)
                    SYNOPSIS += `${arg_name.toUpperCase()} `;
                else
                    SYNOPSIS += `[${arg_name.toUpperCase()}] `;
            } else {
                // Flag
                // If we have more than one flags, print the description on the next line
                // @ts-ignore
                if (arg_obj.short == undefined) arg_obj.short = [];
                if (!Array.isArray(arg_obj.short)) arg_obj.short = [arg_obj.short];
                // @ts-ignore
                if (arg_obj.long == undefined) arg_obj.long = [];
                if (!Array.isArray(arg_obj.long)) arg_obj.long = [arg_obj.long];

                let short = [];
                let long = [];

                for (let short_flag of arg_obj.short) short.push("-" + short_flag);
                for (let long_flag of arg_obj.long) long.push("--" + long_flag);

                // TODO: Implement flag arguments that can take one or more values (+)

                if (short.length + long.length > 1) {
                    if (arg_obj.type === "boolean")
                        DESCRIPTION += `\t\\e[0;32m${short.concat(long).join(" ")}\\e[0m\n\t\t${arg_obj.description}\n\n`;
                    else
                        DESCRIPTION += `\t<b>${short.concat(long).join(" ")}</b>=${arg_name.toUpperCase()}\n\t\t[PUT HELP STRING HERE]\n\n`;
                } else {
                    if (arg_obj.type === "boolean")
                        DESCRIPTION += `\t\\e[0;32m${short.concat(long).join(" ")}\\e[0m\t${arg_obj.description}\n\n`;
                    else
                        DESCRIPTION += `\t<b>${short.concat(long).join(" ")}</b>=${arg_name.toUpperCase()}\n\t\t[PUT HELP STRING HERE]\n\n`;
                }
            }
        }

        return `${NAME}\n\n${SYNOPSIS}\n\n${DESCRIPTION}`;

    }

    public parse(argv: string[] | string): ArgParseResult {
        if (this._did_parse_args) {
            // TODO: Maybe just re-parse or just do nothing?
            this.reset();
            // throw new Error("ArgParser: Already parsed arguments");
        }
        if (typeof argv === "string")
            argv = argv.split(" ");

        this.generate_help();
        this.generate_version();

        // Start by creating a default output object with all the default values
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let output: any = {};
        for (let [name, arg] of this._args) {
            if (arg.default)
                output[name] = arg.default;
            else {
                if (arg.type === "boolean")
                    output[name] = false;
                else
                    output[name] = undefined;
            }
        }

        for (let i = 0; i < argv.length; i++) {
            let arg = argv[i];
            let arg_name;
            // Check if the argument is a flag (starts with '-' or '--' and is not surrounded by quotes)
            if (arg.startsWith("-")) {
                // Check if the argument is a long flag (starts with '--')
                if (arg.startsWith("--")) {
                    if (arg.substring(2) === "help") {
                        this._custom_console_log(this._help_string);
                        return new ArgParseResult({}, true);
                    } else if (arg.substring(2) === "version") {
                        this._custom_console_log(this._version_string);
                        return new ArgParseResult({}, true);
                    }
                    if (!this._has_long_flag(arg.substring(2))) {
                        this._custom_console_log(`${this._name}: Unknown flag ${arg}`);
                        return new ArgParseResult({}, true);
                    }
                    arg_name = arg.substring(2);
                } else {
                    if (!this._has_short_flag(arg.substring(1))) {
                        this._custom_console_log(`${this._name}: Unknown flag ${arg}`);
                        return new ArgParseResult({}, true);
                    }
                    arg_name = arg.substring(1);
                }
                // Determine what type of data to assign to the flag
                let arg_obj = this._get_arg_from_flag(arg_name);
                // This should never be undefined, but we'll check just in case
                if (!arg_obj) {
                    this._custom_console_log(`${this._name}: Unknown flag ${arg}`);
                    return new ArgParseResult({}, true);
                }

                arg_name = arg_obj.name!;

                if (arg_obj.type === "boolean")
                    output[arg_name] = true;
                else if (["string", "int", "float", ""].includes(arg_obj.type!)) {
                    if (argv[i + 1] && !argv[i + 1].startsWith("-"))
                        output[arg_name] = argv[i + 1];
                    else
                        this._custom_console_log(`${this._name}: Missing value for flag ${arg}`);
                } else {
                    // We should never get here
                    this._custom_console_log(`${this._name}: Unknown type ${arg_obj.type}`);
                    return new ArgParseResult({}, true);
                }

                // Now, lets convert the value to the correct type
                if (arg_obj.type === "int")
                    output[arg_name] = parseInt(output[arg_name]);
                else if (arg_obj.type === "float")
                    output[arg_name] = parseFloat(output[arg_name]);

                if (["string", "int", "float"].includes(arg_obj.type!))
                    // Increment the index to skip the next argument
                    i++;

            } else {
                // This is a positional argument
                // Get the positional arguments in order
                let expected_positional_arg = this._get_next_positional_arg();

                // If we have a positional argument, and we're not expecting one, we'll error
                if (expected_positional_arg === undefined) {
                    this._custom_console_log(`${this._name}: Unexpected argument '${arg}'`);
                    return new ArgParseResult({});
                }

                output[expected_positional_arg.name!] = arg;
            }
        }

        // Let's double-check that we have all the required arguments
        let missing_arg;
        this._args.forEach(arg => {
            // If our arg is required, check that it exists in our output
            if (arg.required) {
                // @ts-ignore: arg.name is never undefined
                if (!(arg.name in output) || (output[arg.name] === undefined)) {
                    missing_arg = arg.name;
                    return;
                }
            }
        });

        if (missing_arg) {
            this._custom_console_log(`${this._name}: Missing required argument '${missing_arg}'`);
            return new ArgParseResult({}, true);
        }

        this._did_parse_args = true;

        return new ArgParseResult(output);
    }

    private _has_long_flag(flag: string): boolean {
        for (let [_, arg] of this._args) {
            if (arg.long) {
                if (typeof arg.long === "string") {
                    if (arg.long === flag)
                        return true;
                } else if (Array.isArray(arg.long)) {
                    if (arg.long.includes(flag))
                        return true;
                }
            }
        }
        return false;
    }

    private _has_short_flag(flag: string): boolean {
        for (let [_, arg] of this._args) {
            if (arg.short) {
                if (typeof arg.short === "string") {
                    if (arg.short === flag)
                        return true;
                } else if (Array.isArray(arg.short)) {
                    if (arg.short.includes(flag))
                        return true;
                }
            }
        }
        return false;
    }

    private _get_arg_from_flag(flag: string): Arg | undefined {
        for (let [_, arg] of this._args) {
            if (arg.long) {
                if (typeof arg.long === "string") {
                    if (arg.long === flag)
                        return arg;
                } else if (Array.isArray(arg.long)) {
                    if (arg.long.includes(flag))
                        return arg;
                }
            }

            if (arg.short) {
                if (typeof arg.short === "string") {
                    if (arg.short === flag)
                        return arg;
                } else if (Array.isArray(arg.short)) {
                    if (arg.short.includes(flag))
                        return arg;
                }
            }
        }
        return undefined;
    }

    private _get_next_positional_arg(): Arg | undefined {
        let positional_args = [];
        for (let [_, arg] of this._args) {
            if (arg.positional)
                positional_args.push(arg);
        }

        if (this._positional_arg_counter > positional_args.length)
            return undefined;

        let arg = positional_args[this._positional_arg_counter];
        this._positional_arg_counter++;
        return arg;
    }
}

class ArgParseResult {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private readonly _args: { [key: string]: any };
    private readonly _printed_version_or_help: boolean;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(args: { [key: string]: any }, printed_version_or_help = false) {
        this._args = args;
        this._printed_version_or_help = printed_version_or_help;
    }

    public arguments(): string[] {
        return Object.keys(this._args);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public get(key: string): any {
        return this._args[key];
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public has(key: string): any {
        // eslint-disable-next-line no-prototype-builtins
        return this._args.hasOwnProperty(key) && this._args[key] !== undefined;
    }

    public has_none(): boolean {
        // Loop through each of our possible arguments and check if any of them were provided
        for (let key in this._args) {
            // eslint-disable-next-line no-prototype-builtins
            if (this._args.hasOwnProperty(key)) {
                if (this._args[key])
                    return false;
            }
        }

        return true;
    }

    public printed_version_or_help(): boolean {
        return this._printed_version_or_help;
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
