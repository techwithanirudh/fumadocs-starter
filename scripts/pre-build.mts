async function main() {
  console.log('Generating docs...')
}

await main().catch((e) => {
  console.error('Failed to run pre build script', e)
  process.exit(1)
})
