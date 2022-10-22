export default function deduplicate123(str: string) {
  return str.replace(/(.{1,3}?)\1{1,}/g, '$1');
}
