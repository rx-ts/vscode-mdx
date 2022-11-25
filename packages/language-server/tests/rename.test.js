/**
 * @typedef {import('vscode-languageserver').ProtocolConnection} ProtocolConnection
 */
import assert from 'node:assert'
import { afterEach, beforeEach, test } from 'node:test'

import { InitializeRequest, RenameRequest } from 'vscode-languageserver'

import { createConnection, fixtureUri, openTextDocument } from './utils.js'

/** @type {ProtocolConnection} */
let connection

beforeEach(() => {
  connection = createConnection()
})

afterEach(() => {
  connection.dispose()
})

test('handle rename request of variable for opened references', async () => {
  await connection.sendRequest(InitializeRequest.type, {
    processId: null,
    rootUri: null,
    capabilities: {},
  })

  await openTextDocument(connection, 'node16/b.mdx')
  const { uri } = await openTextDocument(connection, 'node16/a.mdx')
  const result = await connection.sendRequest(RenameRequest.type, {
    newName: 'renamed',
    position: { line: 4, character: 3 },
    textDocument: { uri },
  })

  assert.deepStrictEqual(result, {
    changes: {
      [fixtureUri('node16/a.mdx')]: [
        {
          newText: 'renamed',
          range: {
            start: { line: 1, character: 16 },
            end: { line: 1, character: 17 },
          },
        },
        {
          newText: 'renamed',
          range: {
            start: { line: 4, character: 2 },
            end: { line: 4, character: 3 },
          },
        },
      ],
      [fixtureUri('node16/b.mdx')]: [
        {
          newText: 'renamed',
          range: {
            start: { line: 0, character: 9 },
            end: { line: 0, character: 10 },
          },
        },
      ],
    },
  })
})
