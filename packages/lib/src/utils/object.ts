/**
 * Object.keys but supported typescript values
 * https://stackoverflow.com/questions/52856496/typescript-object-keys-return-string
 * @param {Object} object  an object (please add custom type for this function for complex object)
 * @returns {T[]} keys with custom types
 */
export const getKeys = Object.keys as <T extends object>(
  obj: T
) => Array<keyof T>
