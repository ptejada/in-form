import {SyntheticEvent, useEffect, useRef} from 'react'

type METHOD = 'GET' | 'POST' | 'PUT'

export type FormProps = {
  action?: string
  method?: METHOD
  jsonRequest?: boolean
  onSuccess?: (response: any) => void
  onFailure?: (response: any) => void
  defaults?: {}
}

type ChangeEvent = Event | SyntheticEvent<HTMLInputElement>

/**
 * Sanitize a form name
 *
 * @param name
 */
function cleanName(name: string) {
  const index = name.lastIndexOf('[]')

  if (index > -1) {
    return name.substring(0, index)
  }

  return name
}

function fillForm(form: HTMLFormElement, defaults: any) {
  Object.keys(defaults).forEach(name => {
    let element = form.elements[name]
    const defValue = defaults[name]

    if (element === undefined && Array.isArray(defValue)) {
       element = form.elements[`${name}[]`]
    }

    if (element === undefined) {
      return
    }

    function wrap<T>(list): Array<T & HTMLFormElement> {
      return list.length !== undefined ? list : [list]
    }

    switch (element.tagName) {
      case 'INPUT':
        switch (element.type.toLowerCase()) {
          case 'checkbox':
            if (typeof defValue === 'boolean') {
              wrap(element).forEach(elem => elem.checked = defValue)
            } else if (Array.isArray(defValue)) {
              wrap(element).forEach(elem => elem.checked = defValue.indexOf(element.value) > -1)
            } else {
              wrap(element).forEach(elem => elem.checked = elem.value === defValue)
            }
            break
          case 'radio':
            wrap(element).forEach(elem => elem.checked = elem.value === defValue)
            break
          default:
            element.value = defaults[name]
        }
        break
      case 'SELECT':
        if (element.multiple && Array.isArray(defValue)) {
          element.querySelectorAll('option').forEach(option => {
            option.selected = defValue.indexOf(option.value) > -1
          })
        } else {
          element.querySelectorAll('option').forEach(option => {
            option.selected = option.value === defValue
          })
        }

        break
      case 'TEXTAREA':
        element.value = defaults[name]
        break
    }

    if (element.tagName === 'INPUT') {

    }

  })
}

/**
 * Serialize the form data as string. URl encoded by default
 *
 * @param data
 * @param asJson
 */
function serializeData(data: FormData, asJson: boolean = false) {
  let payload = {}
  for (const name of data.keys()) {
    const value = data.getAll(name)

    payload[cleanName(name)] = value.length === 1 ? value[0] : value
  }

  if (asJson) {
    return JSON.stringify(payload)
  }

  return Object.keys(payload).map(name => {
    const value = payload[name]

    if (Array.isArray(value)) {
      return value.map((value) => {
        return `${name}=${encodeURIComponent(value)}`
      }).join('&')
    }

    return `${name}=${encodeURIComponent(value)}`
  }).join('&')
}

function useForm({action, method = 'POST', jsonRequest = false, defaults = {}, ...options}: FormProps) {
  const formRef = useRef<HTMLFormElement>()

  useEffect(() => {
    const $form = formRef.current
    $form.addEventListener('change', handleChange)

    if (Object.keys(defaults).length) {
      fillForm($form, defaults)
    }

    return () => formRef.current?.removeEventListener('change', handleChange)
  }, [formRef.current])

  function handleChange(event: ChangeEvent) {
    event.preventDefault()
    const {name, value} = event.target as HTMLInputElement

    // setFormData(data => ({...data, ...{[name]: value}}))
  }

  function handleSubmit(event: SyntheticEvent) {
    event.preventDefault()

    if (action?.length) {
      let init: RequestInit = {}

      const data = new FormData(formRef.current)

      if (jsonRequest) {
        init.body = serializeData(data, true)
        init.headers = {'Content-Type': 'application/json'}
      } else {
        init.body = serializeData(data)
        init.headers = {'Content-Type': 'application/x-www-form-urlencoded'}
      }

      let isOk = true

      fetch(action, {
        ...init,
        method,
      }).then((response: Response) => {
        isOk = response.ok

        const contentType = response.headers.get('Content-Type')

        if (typeof contentType == 'string') {
          if (contentType.indexOf('/json') > -1) {
            return response.json()
          }

          if (contentType.indexOf('urlencoded') > -1) {
            return response.formData()
          }
        }

        return response.text()
      }).then((response) => {
        if (isOk) {
          return response
        }

        throw response
      }).then(options.onSuccess)
        .catch(options.onFailure)
    }
  }

  return {
    ref: formRef,
    onSubmit: handleSubmit
  }
}

export {useForm}
