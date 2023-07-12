import RcMenu from 'rc-menu'
import { ReactNode } from 'react'

const MenuItem = RcMenu.Item

export type MenuItem = { key: number | string; title: ReactNode; icon?: ReactNode }

export interface MenuProps {
  menus: MenuItem[]
  onCommand?: (e: { key: string }) => void
  [k: string]: any
}

export default function Menu({ menus, onCommand, ...rest }: MenuProps) {
  return (
    <RcMenu onClick={onCommand} {...rest}>
      {menus.map((menu) => {
        return (
          <MenuItem key={menu.key} className="text-[14px] cursor-pointer hover:bg-gray-200">
            <div className="flex p-1 px-2">
              <div className="mr-2 text-xl">{menu.icon}</div>
              {menu.title}
            </div>
          </MenuItem>
        )
      })}
    </RcMenu>
  )
}
