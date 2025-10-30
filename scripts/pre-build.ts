import { generateDocs } from './generate-docs.js'

async function main() {
  // todo: add content
  await Promise.all([generateDocs()])
}

await main().catch((e) => {
  console.error('Failed to run pre build script', e)
  process.exit(1)
})
