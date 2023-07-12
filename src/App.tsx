import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import SideBar from './components/SideBar'
import Content from './components/Content'

import './App.css'

export default function App() {
  return (
    <PanelGroup direction="horizontal">
      <Panel defaultSize={20} minSize={20}>
        <SideBar />
      </Panel>
      <PanelResizeHandle className="w-[2px] bg-gray-2" />
      <Panel defaultSize={80} minSize={20}>
        <Content />
      </Panel>
    </PanelGroup>
  )
}
