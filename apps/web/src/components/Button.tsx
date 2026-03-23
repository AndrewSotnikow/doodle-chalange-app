import type { ButtonHTMLAttributes } from 'react'
import { cx } from '../utils/cx'

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: 'button',
  secondary: 'button button--secondary',
  inline: 'inline-action'
}

type ButtonVariant = 'primary' | 'secondary' | 'inline'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
}

export function Button({ className, variant = 'primary', ...rest }: ButtonProps) {
  return (
    <button
      className={cx(VARIANT_CLASS[variant], className)}
      {...rest}
    />
  )
}
