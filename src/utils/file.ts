import { Directory, File, FileSystem, FileSystemEntry } from '@/types'
import { generateKey } from '.'

class FileHelper implements FileSystem {
  root: Directory

  constructor(root: Directory) {
    this.root = root
  }

  clone(file: FileSystemEntry, pkey: string, isTop = true) {
    const copiedName = `${file.name}${isTop ? ' copy' : ''}`
    if (file.isFile) {
      return this.createFile(pkey, copiedName)
    }
    const dir = this.createDir(pkey, copiedName)
    dir.children = file.children.map((f) => {
      return this.clone(f, dir.key, false)
    })
    return dir
  }

  createDir(pKey: string, name?: string): Directory {
    return {
      name,
      pKey,
      key: generateKey(),
      isFile: false,
      isDirectory: true,
      children: [],
      isDraft: !name,
    }
  }

  createFile(pKey: string, name?: string): File {
    const type = resolveFileType(name)
    return {
      name,
      type,
      pKey,
      key: generateKey(),
      isFile: true,
      isDirectory: false,
      isDraft: !name,
    }
  }
}

export const rootDirectory: Directory = {
  isRoot: true,
  key: generateKey(),
  name: 'root-folder',
  children: [],
  isDirectory: true,
  isFile: false,
  isDraft: false,
}

export default new FileHelper(rootDirectory)

export const resolveFileType = (filename: string | undefined): string | null => {
  if (!filename) {
    return null
  }
  const ext = filename.match(/\.[0-9a-z]+$/i)?.[0]
  if (!ext) {
    return null
  }
  return ext.slice(1)
}
