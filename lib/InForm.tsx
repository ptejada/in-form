import {ReactNode} from 'react'
import {FormProps, useForm} from './useForm'

export type InFormProps = { children: ReactNode } & FormProps

function InForm({children, ...options}: InFormProps) {
  const formProps = useForm(options)

  function htmlProps() {
    const keys = ['name', 'className', 'key']
    let props = {}

    keys.forEach(key => {
      if (options.hasOwnProperty(key)) {
        props[key] = options[key]
      }
    })

    return {...props, ...formProps}
  }

  return (
    <form {...htmlProps()}>{children}</form>
  )
}

export {InForm}
