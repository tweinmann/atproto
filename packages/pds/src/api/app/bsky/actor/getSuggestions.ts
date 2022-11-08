import { Server } from '../../../../lexicon'
import * as locals from '../../../../locals'
import { paginate } from '../../../../db/util'

export default function (server: Server) {
  server.app.bsky.actor.getSuggestions(async (params, _input, req, res) => {
    let { limit } = params
    const { cursor } = params
    const { db, auth } = locals.get(res)
    const requester = auth.getUserDidOrThrow(req)
    limit = Math.min(limit ?? 25, 100)

    const { ref } = db.db.dynamic

    let suggestionsReq = db.db
      .selectFrom('user')
      .innerJoin('did_handle', 'user.handle', 'did_handle.handle')
      .innerJoin(
        'app_bsky_declaration as declaration',
        'declaration.creator',
        'did_handle.did',
      )
      .leftJoin(
        'app_bsky_profile as profile',
        'profile.creator',
        'did_handle.did',
      )
      .select([
        'did_handle.did as did',
        'did_handle.handle as handle',
        'declaration.actorType as actorType',
        'profile.uri as profileUri',
        'profile.displayName as displayName',
        'profile.description as description',
        'profile.indexedAt as indexedAt',
        'user.createdAt as createdAt',
        db.db
          .selectFrom('app_bsky_follow')
          .where('creator', '=', requester)
          .whereRef('subjectDid', '=', ref('did_handle.did'))
          .select('uri')
          .as('requesterFollow'),
      ])
      .orderBy(ref('user.createdAt'), 'asc')
      .if(limit !== undefined, (q) => q.limit(limit as number))
      .if(cursor !== undefined, (q) =>
        q.where(ref('user.createdAt'), '>', cursor),
      )

    const suggestionsRes = await suggestionsReq.execute()

    const actors = suggestionsRes.map((result) => ({
      did: result.did,
      handle: result.handle,
      actorType: result.actorType,
      displayName: result.displayName ?? undefined,
      description: result.description ?? undefined,
      indexedAt: result.indexedAt ?? undefined,
      myState: {
        follow: result.requesterFollow || undefined,
      },
    }))

    const lastResult = suggestionsRes.at(-1)
    return {
      encoding: 'application/json',
      body: {
        actors,
        cursor: lastResult?.createdAt,
      },
    }
  })
}
