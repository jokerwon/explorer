import { createSlice } from '@reduxjs/toolkit'
import fileHelper, { resolveFileType, rootDirectory } from '@/utils/file'
import { Directory, EntryType, File, FileSystemEntry } from '@/types'
import { findNode as outFind } from '@/utils'

const initialTree: FileSystemEntry[] = [rootDirectory]

interface GlobalState {
  active: FileSystemEntry
  tree: FileSystemEntry[]
  backup: FileSystemEntry[]
  pendingKey: string | null // the key during editing
  transferKey: string | null // the key during copy and paste
}

const findNode = (tree: FileSystemEntry[], key: string) => {
  const compare = (node: FileSystemEntry) => node.key === key
  return outFind(tree as Directory[], compare)
}

export const globalSlice = createSlice({
  name: 'global',
  initialState: {
    active: rootDirectory,
    tree: initialTree,
    backup: initialTree,
    pendingKey: null,
    transferKey: null,
  } as GlobalState,
  reducers: {
    focus(state, { payload }) {
      state.active = payload
    },
    copy(state) {
      state.transferKey = state.active.key
    },
    paste(state) {
      if (!state.transferKey) {
        return
      }
      const activeKey = state.active.key
      const transferKey = state.transferKey
      let target = findNode(state.tree, activeKey)
      let payload = findNode(state.tree, transferKey) as FileSystemEntry
      if (!target || !payload) {
        console.error(`startCreate error => ', 'Cannot find the file named ${state.active.name}`)
        return
      }
      if (target.isFile) {
        // search parent dir
        target = findNode(state.tree, state.active.pKey!)
      }
      payload = fileHelper.clone(payload, target!.key)
      ;(target as Directory)!.children.push(payload)
      state.transferKey = null
    },
    deleteEntry(state) {
      if (!state.active || (state.active as Directory).isRoot) {
        return
      }
      const parent = findNode(state.tree, state.active.pKey!) as Directory
      const idx = parent.children.findIndex((e) => e.key === state.active.key)
      parent.children.splice(idx, 1)
      state.active = rootDirectory
    },
    enterDraft(state: GlobalState) {
      const target = findNode(state.tree, state.active.key)
      if (!target) {
        console.error(`enterDraft error => ', 'Cannot find the file named ${state.active.name}`)
        return
      }
      target.isDraft = true
      state.pendingKey = target.key
    },
    exitDraft(state) {
      state.pendingKey = null
      state.tree = state.backup
    },
    finishDraft(state: GlobalState, { payload }) {
      if (!state.pendingKey) {
        return
      }
      const target = findNode(state.tree, state.pendingKey) as FileSystemEntry
      if (!target) {
        console.error(`submitCreate error => ', 'Cannot find the file named ${state.active.name}`)
        return
      }
      // check if the same name exists
      if (!(target as Directory).isRoot) {
        const parent = findNode(state.tree, target.pKey!) as Directory
        if (parent!.children.some((f) => f.name === payload && ((target.isFile && f.isFile) || (target.isDirectory && f.isDirectory)))) {
          console.error('same name')
          return
        }
      }
      target.name = payload
      if (target.isFile) {
        (target as File).type = resolveFileType(payload)
      }
      target.isDraft = false
      state.pendingKey = null
      state.backup = state.tree
    },
    startCreate(state: GlobalState, { payload }) {
      if (!state.active) {
        return
      }
      const active = state.active
      let target = findNode(state.tree, active.key)
      if (!target) {
        console.error(`startCreate error => ', 'Cannot find the file named ${state.active.name}`)
        return
      }
      if (target.isFile) {
        // search parent dir
        target = findNode(state.tree, active.pKey!)
      }
      if (!target) {
        console.error(`startCreate error => ', 'Cannot find the file named ${state.active.name}`)
        return
      }
      const entry = payload === EntryType.FILE ? fileHelper.createFile(target.key) : fileHelper.createDir(target.key)
      ;(target as Directory)!.children.push(entry)
      state.pendingKey = entry.key
    },
  },
})

export const { startCreate, focus, enterDraft, exitDraft, finishDraft, deleteEntry, copy, paste } = globalSlice.actions

export default globalSlice.reducer
