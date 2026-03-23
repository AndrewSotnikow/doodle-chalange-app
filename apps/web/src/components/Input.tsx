import { forwardRef, type InputHTMLAttributes } from 'react'
import { cx } from '../utils/cx'

type InputProps = InputHTMLAttributes<HTMLInputElement>

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input({ className, ...rest }, ref) {
    return <input className={cx('input', className)} ref={ref} {...rest} />
  }
)
