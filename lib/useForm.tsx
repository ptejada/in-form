import {SyntheticEvent, useEffect, useRef} from 'react'
import {fillForm, formPayload, serializeFormData} from './utils'

type METHOD = 'GET' | 'POST' | 'PUT'

type DefaultValues = {
  [key: string]: string[] | string | boolean
}

type OptionalPromise = Promise<any> | undefined | void
type SubmittingCallback = (inProgress: boolean) => void

export interface FormProps {
  action?: string
  method?: METHOD
  jsonRequest?: boolean
  handleSubmit?: (data, done: (response, isOk?: boolean) => OptionalPromise) => OptionalPromise
  /**
   * Triggered when the submitting state changes
   *
   * @param {boolean} inProgress Whether the submission is in progress or not
   */
  submitting?: SubmittingCallback
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
    submitting = () => {},
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

    const {handleSubmit: submitter} = options
    const data = new window.FormData(formRef.current)

    // Use custom submission handler if provided
    if (typeof submitter === 'function') {
      submitting(true)
      const subPromise = submitter(formPayload(data), (response, isOk) => {
        submitting(false)
        if (isOk === false) {
          options?.onSuccess(response)
        } else {
          options?.onFailure(response)
        }
      })

      if (subPromise && typeof subPromise.then === 'function') {
        return subPromise
          .then(options.onSuccess, options.onFailure)
          .catch(options.onFailure)
          .finally(() => submitting(false))
      }

      return;
    }

    // Continue with the built-in submitter logic
    if (action?.length) {
      let init: RequestInit = {}

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
