export class User {
    private readonly uid: number;
    private readonly username: string;
    private password: string;
    private full_name?: string;
    private room_number?: string;
    private work_phone?: string;
    private home_phone?: string;
    private home_dir?: string;

    constructor(fields: {
        uid: number;
        username: string;
        password: string;
        full_name?: string;
        room_number?: string;
        work_phone?: string;
        home_phone?: string;
        home_dir?: string;
    }) {
        this.uid = fields.uid;
        this.username = fields.username;
        this.password = fields.password;
        this.full_name = fields.full_name;
        this.room_number = fields.room_number;
        this.work_phone = fields.work_phone;
        this.home_phone = fields.home_phone;
        this.home_dir = fields.home_dir;
    }

    get_uid(): number {
        return this.uid;
    }

    get_username(): string {
        return this.username;
    }

    get_home_dir(): string | undefined {
        return this.home_dir;
    }
}

export class Group {
    private gid: number;
    private groupname: string;

    constructor(fields: {
        gid: number;
        groupname: string;
    }) {
        this.gid = fields.gid;
        this.groupname = fields.groupname;
    }
}