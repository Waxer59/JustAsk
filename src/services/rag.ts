const RAG_API_URL = import.meta.env.RAG_API_URL

export const getRagQuery = async (query: string, jwtToken: string) => {
  try {
    const response = await fetch(`${RAG_API_URL}/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`
      },
      body: JSON.stringify({
        question: query
      })
    })
    return await response.json()
  } catch {
    return null
  }
}

export const clearRagDocument = async (
  documentId: string,
  jwtToken: string
) => {
  try {
    const response = await fetch(`${RAG_API_URL}/document`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`
      },
      body: JSON.stringify({
        document_keys: [documentId]
      })
    })
    return await response.json()
  } catch {
    return null
  }
}

export const addRagDocument = async (documentId: string, jwtToken: string) => {
  try {
    const response = await fetch(`${RAG_API_URL}/document`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`
      },
      body: JSON.stringify({
        document_keys: [documentId]
      })
    })
    return await response.json()
  } catch {
    return null
  }
}

export const getAgentQuestion = async (agentId: string, jwtToken: string) => {
  try {
    const response = await fetch(`${RAG_API_URL}/agents/${agentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`
      }
    })
    return await response.json()
  } catch {
    return null
  }
}

export const getAgentFeedback = async (context: string, jwtToken: string) => {
  try {
    const response = await fetch(`${RAG_API_URL}/agents/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`
      },
      body: JSON.stringify({
        context
      })
    })
    return await response.json()
  } catch {
    return null
  }
}

export const getAgents = async (lang: string, jwtToken: string) => {
  try {
    const response = await fetch(`${RAG_API_URL}/agents?lang=${lang}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`
      }
    })
    return await response.json()
  } catch {
    return null
  }
}
