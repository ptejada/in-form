import fillForm from './fillForm'
import serializeFormData, {formPayload} from './serializeFormData'

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

export {fillForm, cleanName, serializeFormData, formPayload}
