import { useEffect, useState } from 'react'
import { FileUploader } from '../common/FileUploader'
import type { FilePondFile } from 'filepond'
import { toast } from 'sonner'
import { getUiTranslations } from '@/i18n/utils'
import type { FilePond } from 'react-filepond'
import { FilesUploadedTable } from './FilesUploadedTable'
import { useQuery } from '@tanstack/react-query'
import type { UploadedDocument } from '@/types'

const { t } = getUiTranslations()

export const StudySectionUploadTab = () => {
  const { data } = useQuery({
    queryKey: ['dashboard/documents'],
    queryFn: async () => {
      const response = await fetch('/api/dashboard/documents')
      return response.json()
    }
  })
  const [isUploading, setIsUploading] = useState(false)
  const [tableData, setTableData] = useState<UploadedDocument[]>([])

  async function addFile(file: FilePondFile, filePondRef?: FilePond) {
    const formData = new FormData()
    formData.append('file', file.file)
    toast.promise(
      fetch('/api/dashboard/documents', {
        method: 'POST',
        body: formData
      }),
      {
        loading: t('fileUpload.uploading'),
        success: () => {
          setIsUploading(false)
          setTableData((tableData) => [
            ...tableData,
            {
              name: file.filename
            }
          ])
          filePondRef?.removeFiles()
          return t('fileUpload.success')
        },
        error: () => {
          setIsUploading(false)
          filePondRef?.removeFiles()
          return t('fileUpload.error')
        }
      }
    )
  }

  useEffect(() => {
    setTableData(data?.documents ?? [])
  }, [data])

  return (
    <>
      <FileUploader
        addFile={addFile}
        removeFile={async () => {}}
        maxFiles={1}
        isDisabled={isUploading}
      />
      <FilesUploadedTable data={tableData} />
    </>
  )
}
