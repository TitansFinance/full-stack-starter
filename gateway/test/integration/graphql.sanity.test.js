const url = `http://127.0.0.1:8000`
const request = require('supertest')(url)

describe('GraphQL', () => {
  it('is sane', async (done) => {
    const { body: { data }, statusCode } = await request.post('/graphql').send({ query: '{ health }'})
    expect(statusCode).toBe(200)
    expect(data.health).toBe(true)
    done()
  })

  it('supportedLanguages', async (done) => {
    const {
      body: {
        data: {
          supportedLanguages,
        },
      },
      statusCode,
    } = await request.post('/graphql').send({ query: '{ supportedLanguages { key name } }'})
    expect(statusCode).toBe(200)
    expect(supportedLanguages).toBeDefined()
    expect(supportedLanguages[0]).toEqual({ key: 'en', name: 'English' })
    expect(supportedLanguages[1]).toEqual({ key: 'zh', name: '中文' })
    done()
  })
})
