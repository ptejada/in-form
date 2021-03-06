import {cleanName} from './index'

function formPayload(data: FormData) {
  let payload = {}
  for (const name of data.keys()) {
    const value = data.getAll(name)

    payload[cleanName(name)] = value.length === 1 ? value[0] : value
  }

  return payload
}

/**
 * Serialize the form data as string. URl encoded by default
 *
 * @param data
 * @param asJson
 */
export default function serializeFormData(data: FormData, asJson: boolean = false): string {
 const payload = formPayload(data)

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

export {formPayload}
