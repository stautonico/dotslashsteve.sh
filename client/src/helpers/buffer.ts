export class Buffer<T> {
    protected _buffer: T[];
    protected onChangeHandler: ((old_value: T[], new_value: T[]) => void) | undefined;

    constructor() {
        this._buffer = [];
    }

    protected callOnChangeHandler(old_value: T[], new_value: T[]) {
        if (this.onChangeHandler) {
            this.onChangeHandler(old_value, new_value);
        }
    }

    protected hasBufferChanged(old_value: T[], new_value: T[]) {
        if (old_value.length !== new_value.length)
            return true;
        for (let i = 0; i < old_value.length; i++) {
            if (old_value[i] !== new_value[i])
                return true;
        }
        return false;
    }

    public clone(): Buffer<T> {
        let new_buf = new Buffer<T>();
        new_buf._buffer = this._buffer.slice();
        return new_buf;
    }

    public pop(index?: number) {
        if (this.length() > 0) {
            let old_value = this.clone();

            let return_value;

            if (index === undefined)
                return_value = this._buffer.pop();
            else
                return_value = this._buffer.splice(index, 1)[0];

            this.callOnChangeHandler(old_value.all(), this.all());

            return return_value;
        }
    }

    public push(data: T, index?: number) {
        let old_value = this.clone();
        if (index === undefined)
            this._buffer.push(data);
        else {
            // If the index exists, replace it
            this._buffer.splice(index, 0, data);
        }

        this.callOnChangeHandler(old_value.all(), this.all());
    }

    public get(index: number) {
        return this._buffer[index];
    }

    public all() {
        // Slice is a shallow copy
        return this._buffer.slice();
    }

    public forEach(callback: (msg: T, index: number) => void) {
        let old_value = this.clone();
        this._buffer.forEach(callback);

        // Check if the buffer has changed
        if (this.hasBufferChanged(old_value.all(), this.all())) {
            this.callOnChangeHandler(old_value.all(), this.all());
        }
    }

    public length() {
        return this._buffer.length;
    }

    public clear() {
        let old_value = this.clone();
        this._buffer = [];
        this.callOnChangeHandler(old_value.all(), this.all());
    }

    public join(separator: string) {
        return this._buffer.join(separator);
    }

    public appendToElement(content: T, index: number) {
        let old_value = this.clone();
        if (typeof content === "string") {
            // @ts-ignore
            this._buffer[index] += content;

            this.callOnChangeHandler(old_value.all(), this.all());
        }

        throw new Error("Cannot use appendToElement on a non-string (type: " + typeof content + ")");
    }

    public lastIndex() {
        return this._buffer.length - 1;
    }

    public onChange(callback: (old_value: T[], new_value: T[]) => void) {
        this.onChangeHandler = callback;
    }

    public last() {
        return this._buffer[this.lastIndex()];
    }
}

export class OutputBuffer extends Buffer<string> {
    // Output buffer is a special class that is used to store the output buffer (duh)
    // It stores individual characters used for manipulating the content on screen
    constructor() {
        super();
    }
    
    public backspace() {
        let old_value = this.clone();
        if (this.length() > 0) {
            this.pop();
        }
        this.callOnChangeHandler(old_value.all(), this.all());
    }
}