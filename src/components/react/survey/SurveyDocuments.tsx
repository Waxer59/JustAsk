import { FileUploader } from '../common/FileUploader'

export const SurveyDocuments = () => {
  const onAddFile = async (file: any) => {
    console.log(file)
  }

  const onRemoveFile = async (file: any) => {
    console.log(file)
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-bold">CV</h2>
        <p>Documento de Curriculum Vitae</p>
      </div>
      <FileUploader
        addFile={onAddFile}
        removeFile={onRemoveFile}
        maxFiles={1}
      />
    </div>
  )
}
