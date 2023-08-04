import * as url from 'url'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { stripIndents } from 'common-tags'

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

const postModerationBehaviorsDef = JSON.parse(
  readFileSync(
    join(
      __dirname,
      '..',
      '..',
      'definitions',
      'post-moderation-behaviors.json',
    ),
    'utf8',
  ),
)

writeFileSync(
  join(__dirname, '..', '..', 'docs', 'moderation-behaviors', 'posts.md'),
  posts(),
  'utf8',
)

function posts() {
  let lastTitle = 'NULL'
  return stripIndents`
  <!-- this doc is generated by ./scripts/docs/post-moderation-behaviors.mjs -->

  # Post moderation behaviors
  
  This document is a reference for the expected behaviors for a post in the application based on some given scenarios. The <code>moderatePost()</code> command condense down to the following yes or no decisions:

  - <code>res.content.filter</code> Do not show the post in feeds.
  - <code>res.content.blur</code> Put the post behind a warning cover.
  - <code>res.content.noOverride</code> Do not allow the post's blur cover to be lifted.
  - <code>res.content.alert</code> Add a warning to the post but do not cover it.
  - <code>res.avatar.blur</code> Put the avatar behind a cover.
  - <code>res.avatar.noOverride</code> Do not allow the avatars's blur cover to be lifted.
  - <code>res.avatar.alert</code> Put a warning icon on the avatar.
  - <code>res.embed.blur</code> Put the embed content (media, quote post) behind a warning cover.
  - <code>res.embed.noOverride</code> Do not allow the embed's blur cover to be lifted.
  - <code>res.embed.alert</code> Put a warning on the embed content (media, quote post).
 
  Key:

  - ❌ = Filter Content
  - 🚫 = Blur (no-override)
  - ✋ = Blur
  - 🪧 = Alert

  ## Scenarios

  <table>
    ${Array.from(Object.entries(postModerationBehaviorsDef.scenarios))
      .map(([title, scenario], i) => {
        const str = `
          ${title.indexOf(lastTitle) === -1 ? postTableHead() : ''}
          ${scenarioSection(title, scenario)}
        `
        lastTitle = title.slice(0, 10)
        return str
      })
      .join('\n\n')}
  </table>
  `
}

function postTableHead() {
  return `<tr><th>Scenario</th><th>Filter</th><th>Content</th><th>Avatar</th><th>Embed</th></tr>`
}

function scenarioSection(title, scenario) {
  return stripIndents`
  <tr>
    <td><strong>${title}</strong></td>
    <td>
      ${filter(scenario.behaviors.content?.filter)}
    </td>
    <td>
      ${blur(
        scenario.behaviors.content?.blur,
        scenario.behaviors.content?.noOverride,
      )}
      ${alert(scenario.behaviors.content?.alert)}
    </td>
    <td>
      ${blur(
        scenario.behaviors.avatar?.blur,
        scenario.behaviors.avatar?.noOverride,
      )}
      ${alert(scenario.behaviors.avatar?.alert)}
    </td>
    <td>
      ${blur(
        scenario.behaviors.embed?.blur,
        scenario.behaviors.embed?.noOverride,
      )}
      ${alert(scenario.behaviors.embed?.alert)}
    </td>
  </tr>
  `
}

function filter(val) {
  return val ? '❌' : ''
}

function blur(val, noOverride) {
  if (val) {
    return noOverride ? '🚫' : '✋'
  }
  return ''
}

function alert(val) {
  return val ? '🪧' : ''
}

export {}