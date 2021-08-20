import {SyntheticEvent, useEffect, useRef} from 'react'
import {fillForm, serializeFormData} from './utils'

type METHOD = 'GET' | 'POST' | 'PUT'
type DefaultValues = {
  [key: string]: string[] | string | boolean
}

export interface FormProps {
  action?: string
  method?: METHOD
  jsonRequest?: boolean
  /**
   * Triggered when the submitting state changes
   *
   * @param {boolean} inProgress Whether the submission is in progress or not
   */
  submitting?: (inProgress: boolean) => void
  /**
   * Triggered on a successful submission
   * @param response
   */
  onSuccess?: (response: any) => void
  /**
   * Triggered on when error occurs with the submission.
   * If the response is not within the http code 200-299 or there is any network error
   *
   * @param response
   */
  onFailure?: (response: any) => void
  defaults?: DefaultValues
}

type ChangeEvent = Event | SyntheticEvent<HTMLInputElement>

function useForm({action, method = 'POST', jsonRequest = false, defaults = {}, ...options}: FormProps) {
  const formRef = useRef<HTMLFormElement>()
  const {
    submitting = () => {
    }
  } = options

  useEffect(() => {
    const $form = formRef.current

    if ($form) {
      $form.addEventListener('change', handleChange)

      if (Object.keys(defaults).length) {
        fillForm($form, defaults)
      }

      return () => $form.removeEventListener('change', handleChange)
    }
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
        init.body = serializeFormData(data, true)
        init.headers = {'Content-Type': 'application/json'}
      } else {
        init.body = serializeFormData(data)
        init.headers = {'Content-Type': 'application/x-www-form-urlencoded'}
      }

      let isOk = true

      // Triggers the submission hook letting the consumer know the submission is progress
      submitting(true)

      fetch(action, {
        ...init,
        method,
      }).then((response: Response) => {
        isOk = response.ok

        // Trigger the submission hook to notify the consumer the submission has ended
        submitting(false)

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
