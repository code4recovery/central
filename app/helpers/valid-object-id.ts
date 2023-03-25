export function validObjectId(objectID?: string) {
  return objectID?.match(/^[0-9a-fA-F]{24}$/);
}
