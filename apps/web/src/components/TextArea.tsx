import { forwardRef, type TextareaHTMLAttributes } from 'react'
import { cx } from '../utils/cx'

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement>

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  function TextArea({ className, ...rest }, ref) {
    return <textarea className={cx('textarea', className)} ref={ref} {...rest} />
  }
)
