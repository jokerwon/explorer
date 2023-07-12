export function generateKey() {
  const timestamp = Date.now().toString(36) // 使用时间戳作为前缀
  const randomStr = Math.random().toString(36).substr(2, 9) // 使用随机数作为后缀
  return `${timestamp}${randomStr}`
}

export function findNode<T extends { children: any[] }>(tree: T[], compare: (node: T) => boolean): T | null {
  for (const node of tree) {
    if (compare(node)) return node
    if (node.children) {
      const res = findNode(node.children, compare)
      if (res) return res
    }
  }
  return null
}
