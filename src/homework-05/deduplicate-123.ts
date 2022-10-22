export default function deduplicate123(str: string) {
  return str.replace(/(.|..|...)\1{1,}/g, (_, group) => group);
}
