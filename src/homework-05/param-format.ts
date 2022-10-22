export default function paramFormat(tmpl: string, params: Record<string, unknown>) {
  return tmpl.replace(/\$\{([\w-\s]+)\}/g, (_, key) => (String(params[key] || '')));
}
