export const DefaultFile = () => <div className="i-vscode-icons:default-file" />
export const Directory = () => <div className="i-vscode-icons:default-folder" />
export const Typescript = () => <div className="i-vscode-icons:file-type-typescript" />
export const Javascript = () => <div className="i-vscode-icons:file-type-js-official" />
export const Json = () => <div className="i-vscode-icons:file-type-json" />
export const Text = () => <div className="i-vscode-icons:file-type-text" />
export const NewFile = () => <div className="i-carbon:document-add" />
export const NewFolder = () => <div className="i-carbon:folder-add" />
export const Delete = () => <div className="i-carbon:trash-can" />
export const Edit = () => <div className="i-carbon:edit" />

export const RightArrow = () => <div className="i-carbon:chevron-right" />
export const DownArrow = () => <div className="i-carbon:chevron-down" />

const fileIconMap: Record<string, any> = {
  ts: <Typescript />,
  js: <Javascript />,
  json: <Json />,
  txt: <Text />,
}

export const getFileIcon = (type?: string | null) => {
  if (!type) {
    return <DefaultFile />
  }
  return fileIconMap[type] || <DefaultFile />
}
