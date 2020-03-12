const path = require('path')
const spawn = require('cross-spawn');

module.exports = (options = {}, context) => ({
  extendPageData ($page) {
    const { transformer } = options
    const timestamp = getGitFirstCommitTimeStamp($page._filePath)
    const $lang = $page._computed.$lang
    if (timestamp) {
      const firstCreated = typeof transformer === 'function'
        ? transformer(timestamp, $lang)
        : defaultTransformer(timestamp, $lang)
      $page.firstCreated = firstCreated
    }
  }
})

function defaultTransformer (timestamp, lang) {
  return new Date(timestamp).toLocaleString(lang)
}

function getGitFirstCommitTimeStamp (filePath) {
  let firstCreated
  try {
    firstCreated = parseInt(spawn.sync(
      'sh',
      ['-c', 'git log --reverse --format=%at ' + filePath + ' | head -1'],
      { cwd: path.dirname(filePath) }
    ).stdout.toString('utf-8')) * 1000
  } catch (e) { console.log(e) }
  return firstCreated
}