export enum EntryType {
  FILE,
  DIRECTORY,
}

interface Base {
  key: string
  pKey?: string
  name?: string
  isFile: boolean
  isDirectory: boolean
  // createdAt: Date
  // modifiedAt: Date
  isDraft: boolean
}

export interface File extends Base {
  type: string | null
  isFile: true
  isDirectory: false
}

export interface Directory extends Base {
  isRoot?: boolean
  isFile: false
  isDirectory: true
  children: (File | Directory)[]
}

export type FileSystemEntry = File | Directory

export interface FileSystem {
  root: Directory
  // getFile(path: string): File | null
  // getDirectory(path: string): Directory | null
  // createFile(path: string, name: string): File | null
  // createDirectory(path: string, name: string): Directory | null
  // deleteFile(path: string): boolean
  // deleteDirectory(path: string): boolean
  // renameFile(path: string, newName: string): boolean
  // renameDirectory(path: string, newName: string): boolean
}
