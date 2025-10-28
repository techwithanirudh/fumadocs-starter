async function main() {
  // todo: add content
  // await Promise.all([])
}

await main().catch((e) => {
  console.error('Failed to run pre build script', e)
  process.exit(1)
})
