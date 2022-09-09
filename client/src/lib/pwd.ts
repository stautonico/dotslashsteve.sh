import { computer } from "../util/globals";

export interface passwd {
  pw_name: string;
  pw_passwd: string; // Reads from /etc/passwd, returns 'x' if password is stored in shadow
  pw_uid: number;
  pw_gid: number;
  pw_change: number; // Posix says not supported
  pw_class: string; // Posix says not supported
  pw_gecos: string;
  pw_dir: string;
  pw_shell: string;
  pw_expire: number;
}

export function getpwnam(name: string): passwd | undefined {
  // TODO: Implement
  return undefined;
}

export function getpwuid(uid: number): passwd | undefined {
  // If /etc/passwd doesn't exist, return undefined
  let read_result = computer.sys$read("/etc/passwd");
  if (read_result.fail()) {
    return undefined;
  }

  let user = computer.get_user({ uid });

  if (!user) {
    // Real getpwuid crashes the program if the user doesn't exist
    throw new Error("User doesn't exist"); // Will be caught by the terminal
  }

  return {
    pw_name: user.get_username(),
    pw_passwd: "x",
    pw_uid: user.get_uid(),
    pw_gid: 0,
    pw_change: 0,
    pw_class: "",
    pw_gecos: "", // TODO: Implement
    pw_dir: user.get_home_dir() || "",
    pw_shell: "/bin/shell",
    pw_expire: 0,
  };
}
