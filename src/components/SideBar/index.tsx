import { useCallback, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import classnames from 'classnames'
import Tree, { TreeNode } from 'rc-tree'

import Dropdown from 'rc-dropdown'
import { Directory, EntryType, File, FileSystemEntry } from '@/types'
import { RootState } from '@/store'
import { startCreate, exitDraft, focus, finishDraft, deleteEntry, enterDraft, paste, copy } from '@/store/global'
import Input from './Input'
import Menu, { MenuItem } from './Menu'
import { Delete, Directory as DirectoryIcon, Edit, NewFile, NewFolder, getFileIcon } from '../Icon'

import 'rc-dropdown/assets/index.css'
import './index.less'

enum Command {
  NEW_FILE,
  NEW_FOLDER,
  UNLINK,
  RENAME,
}

const menus: MenuItem[] = [
  { key: Command.NEW_FILE, title: 'New File', icon: <NewFile /> },
  { key: Command.NEW_FOLDER, title: 'New Folder', icon: <NewFolder /> },
  { key: Command.UNLINK, title: 'Delete', icon: <Delete /> },
  { key: Command.RENAME, title: 'Rename', icon: <Edit /> },
]

export default function SideBar() {
  const dispatch = useDispatch()
  const [expanded, setExpanded] = useState<string[]>([])
  const { tree = [], active, pendingKey } = useSelector((state: RootState) => state.global)

  const handleAdd = (entryType: EntryType) => {
    if (pendingKey) {
      return
    }
    setExpanded((keys) => [...new Set([...keys, active.key])])
    dispatch(startCreate(entryType))
  }
  const handleDelete = () => {
    dispatch(deleteEntry())
  }
  const handleRename = () => {
    dispatch(enterDraft())
  }
  const handleBlur = () => {
    dispatch(exitDraft())
  }
  const handleSelect = (_: any, target: any) => {
    console.log(target)
    const { data } = target
    dispatch(focus({ ...data }))
  }
  const handleNameSubmit = (e: any) => {
    if (e.target.value) {
      dispatch(finishDraft(e.target.value))
    }
  }
  const handleCommand = ({ key }: any) => {
    switch (key) {
      case Command.NEW_FILE:
        handleAdd(EntryType.FILE)
        break
      case Command.NEW_FOLDER:
        handleAdd(EntryType.DIRECTORY)
        break
      case Command.UNLINK:
        handleDelete()
        break
      case Command.RENAME:
        handleRename()
        break
      default:
        break
    }
  }
  const handleCopy = useCallback(
    (e: any) => {
      console.log('copy', active, e)
      dispatch(copy())
    },
    [active]
  )
  const handlePaste = useCallback(
    (e: any) => {
      console.log('paste', active, e)
      dispatch(paste())
    },
    [active]
  )

  useEffect(() => {
    document.addEventListener('copy', handleCopy)
    return () => {
      document.removeEventListener('copy', handleCopy)
    }
  }, [handleCopy])
  useEffect(() => {
    document.addEventListener('paste', handlePaste)
    return () => {
      document.removeEventListener('paste', handlePaste)
    }
  }, [handlePaste])

  const treeRender = (data: FileSystemEntry[]) =>
    data.map((item: FileSystemEntry) => {
      const { isDraft, key, name, isDirectory } = item
      if (isDraft) {
        return <TreeNode key={key} icon={isDirectory ? <DirectoryIcon /> : getFileIcon()} title={<Input defaultValue={name} autoFocus onBlur={handleBlur} onEnterPress={handleNameSubmit} />} />
      }
      const isFocus = item.key === active.key
      const className = classnames(['hover:bg-gray-200', { 'bg-gray-200': isFocus }])
      if (isDirectory && (item as Directory).children) {
        return (
          <TreeNode key={key} className={className} title={name} icon={<DirectoryIcon />} data={item as { key: string }}>
            {treeRender((item as Directory).children)}
          </TreeNode>
        )
      }
      return <TreeNode key={key} className={className} title={name} data={item as { key: string }} icon={getFileIcon((item as File).type)} />
    })
  const treeNodes = treeRender(tree)

  return (
    <aside className="w-1/4 h-full border-1 border-gray-400 border-solid resize-x">
      <header className="flex justify-between items-center px-4 py-2">
        <span className="uppercase">Explorer</span>
        <Dropdown trigger={['click']} overlay={<Menu menus={menus} onCommand={handleCommand} />} animation="slide-up">
          <div className="p-[2px] rounded-1 text-xl cursor-pointer hover:bg-gray-200">
            <div className="i-carbon:overflow-menu-horizontal" />
          </div>
        </Dropdown>
        {/* <div className="flex">
          <div className="p-[2px] rounded-1 text-xl cursor-pointer hover:bg-gray-200">
            <div className="i-carbon:document-add" onClick={handleAdd.bind(null, EntryType.FILE)}></div>
          </div>
          <div className="ml-2 p-[2px] rounded-1 text-xl cursor-pointer hover:bg-gray-200">
            <div className="i-carbon:folder-add" onClick={handleAdd.bind(null, EntryType.DIRECTORY)}></div>
          </div>
        </div> */}
      </header>
      <div className="p-2">
        <Tree
          showLine
          selectable={false}
          expandedKeys={expanded}
          expandAction="click"
          onExpand={(expandedKeys) => {
            setExpanded(expandedKeys as string[])
          }}
          onClick={handleSelect}
        >
          {treeNodes}
        </Tree>
      </div>
    </aside>
  )
}
