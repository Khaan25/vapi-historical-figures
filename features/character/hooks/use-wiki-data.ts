import { useState } from 'react'

interface WikiData {
  name: string
  bio: string
  shortDesc: string | null
  imageUrl: string | null
  dateOfBirth: Date | null
  dateOfDeath: Date | null
  notableWorks: string[]
}

interface WikiResponse {
  data: WikiData | null
  isLoading: boolean
  error: string | null
  fetchData: (name: string) => Promise<void>
}

export function useWikiData(): WikiResponse {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<WikiData | null>(null)

  const fetchData = async (name: string) => {
    if (!name) return

    setIsLoading(true)
    setError(null)

    try {
      // Step 1: Get Wikipedia page data
      const wikiResp = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(name)}&prop=pageprops|extracts|pageimages|description|categories&explaintext=true&pithumbsize=500&format=json&exsectionformat=plain&origin=*`
      )
      const wikiData = await wikiResp.json()
      const pages = wikiData.query.pages
      const page = Object.values(pages)[0] as {
        pageid: number
        title: string
        extract: string
        description?: string
        pageprops: {
          wikibase_item: string
          'wikibase-shortdesc'?: string
        }
        thumbnail?: {
          source: string
        }
      }

      if (!page || page.pageid === -1) {
        throw new Error('No Wikipedia article found for this name')
      }

      const shortDesc = page.description || page.pageprops?.['wikibase-shortdesc']
      const wikidataId = page.pageprops?.wikibase_item
      if (!wikidataId) {
        throw new Error('No Wikidata ID found for this article')
      }

      // Step 2: Fetch Wikidata entity data
      const wdResp = await fetch(`https://www.wikidata.org/wiki/Special:EntityData/${wikidataId}.json`)
      const wdData = await wdResp.json()
      const entity = wdData.entities[wikidataId]
      const claims = entity.claims

      // Helper: extract date string from Wikidata time format
      function getDate(prop: string) {
        if (!claims[prop]) return null
        const timeStr = claims[prop][0].mainsnak.datavalue.value.time
        return new Date(timeStr.slice(1, 11)) // Convert "YYYY-MM-DD" to Date
      }

      // Helper: get notable works labels
      async function getNotableWorksLabels() {
        if (!claims.P800) return []
        const workIds = claims.P800.map((w: { mainsnak: { datavalue: { value: { id: string } } } }) => w.mainsnak.datavalue.value.id)
        if (workIds.length === 0) return []

        // Fetch labels for all notable works in one request
        const idsStr = workIds.join('|')
        const labelsResp = await fetch(`https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${idsStr}&props=labels&languages=en&format=json&origin=*`)
        const labelsData = await labelsResp.json()
        return workIds.map((id: string) => labelsData.entities[id]?.labels?.en?.value).filter(Boolean)
      }

      const dateOfBirth = getDate('P569')
      const dateOfDeath = getDate('P570')
      const notableWorks = await getNotableWorksLabels()

      setData({
        name: page.title,
        bio: page.extract,
        shortDesc: shortDesc || null,
        imageUrl: page.thumbnail?.source || null,
        dateOfBirth,
        dateOfDeath,
        notableWorks,
      })
    } catch (error) {
      console.error('Data fetch error:', error)
      setError(error instanceof Error ? error.message : 'Failed to fetch data')
      setData(null)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    data,
    isLoading,
    error,
    fetchData,
  }
}
