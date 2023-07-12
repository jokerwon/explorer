import { useCallback, type InputHTMLAttributes, type KeyboardEvent, type KeyboardEventHandler, useEffect, useRef } from 'react'

export interface InputProps<T = any> extends InputHTMLAttributes<T> {
  keepfocus?: boolean
  onEnterPress?: (e: KeyboardEvent) => void
}

export default function Input({ keepfocus, onEnterPress, ...props }: InputProps) {
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (keepfocus) {
      ref.current?.focus()
    }
  }, [])

  const onKeyUp: KeyboardEventHandler<HTMLElement> = useCallback(
    (e) => {
      props.onKeyUp?.(e)
      if (e.keyCode === 13) {
        onEnterPress?.(e)
      }
    },
    [onEnterPress]
  )

  const onBlur = (e: any) => {
    if (keepfocus) {
      ref.current?.focus()
    }
    props.onBlur?.(e)
  }

  return <input className="text-[16px] outline-none border-[1px] border-solid border-gray-200" autoFocus={keepfocus} ref={ref} {...props} onKeyUp={onKeyUp} onBlur={onBlur} />
}
