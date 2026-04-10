export {}

async function main() {
  // Add pre-build tasks here if needed
}

await main().catch((e) => {
  console.error('Failed to run pre build script', e)
  process.exit(1)
})
