export interface StatStruct {
  dev: number;
  ino: number;
  mode: number;
  nlink: number;
  uid: number;
  gid: number;
  rdev: number;
  size: number;
  atime: number;
  mtime: number;
  ctime: number;
  crtime: number;
}

export function stat(_path: string): StatStruct | undefined {
  // TODO: Implement
  throw new Error("Not implemented");
  // return computer.sys$stat(path).get_data();
}

export function ISDIR(_path: string): boolean {
  // TODO: Implement
  throw new Error("Not implemented");
  // const find_result = computer.find(path);
  //
  // if (find_result.fail())
  //     return false;
  //
  // return find_result.get_data()!.is_directory();
}

export function ISREG(_path: string): boolean {
  // TODO: Implement
  throw new Error("Not implemented");
  // const find_result = computer.find(path);
  //
  // if (find_result.fail())
  //     return false;
  //
  // return find_result.get_data()!.is_file();
}
