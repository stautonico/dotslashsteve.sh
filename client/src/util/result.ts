export enum ResultMessages {
    NOT_ALLOWED = "ResultMessages.NOT_ALLOWED",
    ALREADY_EXISTS = "ResultMessages.ALREADY_EXISTS",
    NOT_FOUND = "ResultMessages.NOT_FOUND",
    IS_FILE = "ResultMessages.IS_FILE",
    IS_DIRECTORY = "ResultMessages.IS_DIRECTORY",
    MISSING_ARGUMENT = "ResultMessages.MISSING_ARGUMENT",
    TOO_MANY_ARGUMENTS = "ResultMessages.TOO_MANY_ARGUMENTS",
    NOT_ALLOWED_READ = "ResultMessages.NOT_ALLOWED_READ",
    NOT_ALLOWED_WRITE = "ResultMessages.NOT_ALLOWED_WRITE",
    NOT_ALLOWED_EXECUTE = "ResultMessages.NOT_ALLOWED_EXECUTE",
    EMPTY = "ResultMessages.EMPTY",
    NOT_EMPTY = "ResultMessages.NOT_EMPTY",
    GENERIC = "ResultMessages.GENERIC",
    SUCCESS = "ResultMessages.SUCCESS",
}

export class Result<T> {
    private readonly success: boolean;
    private readonly message?: ResultMessages;
    private readonly data?: T;

    constructor(options: {
        success: boolean;
        message?: ResultMessages;
        data?: T;
    }) {
        this.success = options.success;
        this.message = options.message;
        this.data = options.data;
    }

    fail(): boolean {
        return !this.success;
    }

    ok(): boolean {
        return this.success;
    }

    get_data(): T | undefined {
        return this.data;
    }

    get_message(): ResultMessages | undefined {
        return this.message;
    }
}