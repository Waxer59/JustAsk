import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
import 'filepond/dist/filepond.min.css'
import { ALLOWED_FILE_MIME_TYPES } from '@/constants'
import { FilePond, registerPlugin } from 'react-filepond'
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import { useRef } from 'react'
import type { FilePondFile } from 'filepond'

registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginFileValidateSize,
  FilePondPluginFileValidateType
)

interface Props {
  addFile: (file: FilePondFile) => Promise<void>
  removeFile: (file: FilePondFile) => Promise<void>
  onAddingFile?: (file: FilePondFile) => Promise<void>
  maxFiles?: number
  isDisabled?: boolean
  defaultFiles?: File[]
}

export const FileUploader: React.FC<Props> = ({
  addFile,
  removeFile,
  onAddingFile,
  isDisabled,
  maxFiles = 10,
  defaultFiles
}) => {
  const filepondRef = useRef<FilePond>(null)

  return (
    <FilePond
      ref={filepondRef}
      onaddfile={(_, file) => {
        const metadata = file.getMetadata()

        // Default file dont trigger onaddfile event
        // to avoid duplicated files
        if (metadata?.isDefault) {
          return
        }

        addFile(file)
      }}
      onremovefile={(_, file) => {
        removeFile(file)
      }}
      onaddfilestart={(file) => onAddingFile?.(file)}
      disabled={isDisabled}
      allowMultiple={maxFiles > 1}
      maxFiles={maxFiles}
      credits={false}
      acceptedFileTypes={ALLOWED_FILE_MIME_TYPES}
      maxTotalFileSize="50MB"
      oninit={() => {
        if (defaultFiles) {
          defaultFiles.forEach((file) => {
            if (!file) return

            // Mark file as default to prevent it from being processed
            filepondRef.current?.addFile(file, {
              metadata: { isDefault: true }
            })
          })
        }
      }}
    />
  )
}
