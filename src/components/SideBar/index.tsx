import { useCallback, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import classnames from 'classnames'
import Dropdown from 'rc-dropdown'
import { useNotification } from 'rc-notification'
import Tree, { TreeNode } from 'rc-tree'
import { Directory, EntryType, File, FileSystemEntry } from '@/types'
import { RootState } from '@/store'
import { startCreate, exitDraft, focus, finishDraft, deleteEntry, enterDraft, paste, copy } from '@/store/global'
import Input from './Input'
import Menu, { MenuItem } from './Menu'
import { Delete, Directory as DirectoryIcon, Edit, NewFile, NewFolder, getFileIcon } from '../Icon'

import 'rc-notification/assets/index.css'
import 'rc-dropdown/assets/index.css'
import 'rc-tree/assets/index.css'
import './index.less'

enum Command {
  NEW_FILE,
  NEW_FOLDER,
  UNLINK,
  RENAME,
}

export default function SideBar() {
  const [notice, holder] = useNotification({
    motion: {
      motionName: 'rc-notification-fade',
      motionAppear: true,
      motionEnter: true,
      motionLeave: true,
      onLeaveStart: (ele: any) => {
        const { offsetHeight } = ele
        return { height: offsetHeight }
      },
      onLeaveActive: () => ({ height: 0, opacity: 0, margin: 0 }),
    },
  })
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
      try {
        dispatch(finishDraft(e.target.value))
      } catch (error) {
        notice.open({
          content: (error as Error).message,
          duration: 3,
        })
      }
    }
  }
  const handleCommand = ({ key }: any) => {
    switch (Number(key)) {
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
      const title = !isDraft ? name : <Input defaultValue={name} autoFocus onBlur={handleBlur} onEnterPress={handleNameSubmit} />
      const isFocus = item.key === active.key
      const className = classnames(['hover:bg-gray-200', { 'bg-gray-200': isFocus }])
      if (isDirectory && (item as Directory).children) {
        return (
          <TreeNode key={key} className={className} title={title} icon={<DirectoryIcon />} data={item as { key: string }}>
            {treeRender((item as Directory).children)}
          </TreeNode>
        )
      }
      return <TreeNode key={key} className={className} title={title} data={item as { key: string }} icon={getFileIcon((item as File).type)} />
    })
  const treeNodes = treeRender(tree)
  const menus: MenuItem[] = [
    { key: Command.NEW_FILE, title: 'New File', icon: <NewFile /> },
    { key: Command.NEW_FOLDER, title: 'New Folder', icon: <NewFolder /> },
    { key: Command.RENAME, title: 'Rename', icon: <Edit /> },
  ]
  if (!(active as Directory).isRoot) {
    menus.push({ key: Command.UNLINK, title: 'Delete', icon: <Delete /> })
  }

  return (
    <aside className="w-full h-full">
      <header className="flex justify-between items-center px-2 py-2">
        <span className="uppercase">Explorer</span>
        <Dropdown trigger={['click']} overlay={<Menu menus={menus} onCommand={handleCommand} />} animation="slide-up">
          <div className="p-[2px] rounded-1 text-xl cursor-pointer hover:bg-gray-200">
            <div className="i-carbon:overflow-menu-horizontal" />
          </div>
        </Dropdown>
      </header>
      <div>
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
      {holder}
    </aside>
  )
}
