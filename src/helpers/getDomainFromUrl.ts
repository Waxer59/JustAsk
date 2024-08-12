export const getDomainFromUrl = (url: string) => {
  const urlObject = new URL(url)
  const domain = urlObject.hostname
    .replace(/^www\./, '')
    .split('.')
    .reverse()
    .splice(0, 2)
    .reverse()
    .join('.')
  return domain
}
