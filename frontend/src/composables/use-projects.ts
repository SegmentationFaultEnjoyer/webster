import { api } from '@/api'
import { JsonApiRecordBase, PageOrder } from '@/api/json-api'
import { config } from '@/config'
import { CanvasRepresentation } from '@/types'

export type ProjectInfo = JsonApiRecordBase<'projects'> & {
  owner: string
  title: string
  content: CanvasRepresentation
  created_at: string
}

export type ProjectBackgroundResponse = JsonApiRecordBase<'url'> & {
  url: string
}

export function useProjects() {
  const createProject = (opts: {
    owner: string
    title: string
    content: string
  }) => {
    return api.post('/projects', {
      data: {
        attributes: opts,
      },
    })
  }

  const updateProject = (opts: {
    id: string
    owner?: string
    title?: string
    content?: string
  }) => {
    return api.patch(`/projects/${opts.id}`, {
      data: {
        attributes: {
          ...(opts.owner ? { owner: opts.owner } : {}),
          ...(opts.title ? { title: opts.title } : {}),
          ...(opts.content ? { content: opts.content } : {}),
        },
      },
    })
  }

  const getProjectsList = (opts?: {
    owner?: string
    pageLimit?: number
    pageOrder?: PageOrder
  }) => {
    return api.get<ProjectInfo[]>('/projects', {
      page: {
        limit: opts?.pageLimit ?? config.DEFAULT_PAGE_LIMIT,
        order: opts?.pageOrder ?? 'desc',
      },
      filter: {
        ...(opts?.owner ? { owner: opts.owner } : {}),
      },
    })
  }

  const getProject = (id: string) => {
    return api.get<ProjectInfo>(`/projects/${id}`)
  }

  const deleteProject = (id: string) => {
    return api.delete(`/projects/${id}`)
  }

  const uploadProjectBackground = async (
    projectId: string,
    background: File,
  ) => {
    const formData = new FormData()
    formData.append('file', background)

    const { data } = await api.post<ProjectBackgroundResponse>(
      `/projects/${projectId}/background`,
      formData,
    )

    return data.url
  }

  return {
    createProject,
    getProjectsList,
    getProject,
    updateProject,
    deleteProject,
    uploadProjectBackground,
  }
}
