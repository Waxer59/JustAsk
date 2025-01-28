import { useState } from 'react'
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import { ArrowUpDown, ChevronDown, MoreHorizontalIcon } from 'lucide-react'
import { Button } from '@ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel
} from '@ui/dropdown-menu'
import { Input } from '@ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@ui/table'
import type { SurveyResult } from '@/types'
import exportFromJSON from 'export-from-json'
import { getUiTranslations } from '@/i18n/utils'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/ui/dialog'
import { DialogTrigger } from '@radix-ui/react-dialog'
import { Message } from '../common/Message'

const { t } = getUiTranslations()

const columns: ColumnDef<SurveyResult>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          {t('dashboard.table.name')}
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => <div className="capitalize">{row.getValue('name')}</div>
  },
  {
    accessorKey: 'email',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          {t('dashboard.table.email')}
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => <div className="capitalize">{row.getValue('email')}</div>
  },
  {
    accessorKey: 'category',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          {t('dashboard.table.category')}
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue('category')}</div>
    )
  },
  {
    accessorKey: 'overallScore',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          {t('dashboard.table.overallScore')}
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue('overallScore')}</div>
    )
  },
  {
    accessorKey: 'softSkillsScore',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          {t('dashboard.table.softSkillsScore')}
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue('softSkillsScore')}</div>
    )
  },
  {
    accessorKey: 'hardSkillsScore',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          {t('dashboard.table.hardSkillsScore')}
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue('hardSkillsScore')}</div>
    )
  },
  {
    accessorKey: 'isAttempt',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          {t('dashboard.table.isAttempt')}
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="capitalize">
        {row.getValue('isAttempt')
          ? t('dashboard.table.isAttempt.true')
          : t('dashboard.table.isAttempt.false')}
      </div>
    )
  },
  {
    accessorKey: t('dashboard.table.actions'),
    enableHiding: false,
    cell: ({ row }) => {
      const [dialogMenu, setDialogMenu] = useState<string>('viewChat')
      const data = row.original
      const handleDialogMenu = (): JSX.Element | null => {
        switch (dialogMenu) {
          case 'viewChat':
            return (
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="capitalize">{data.name}</DialogTitle>
                  <DialogDescription>
                    {t('dashboard.table.actions.viewChat.description')}
                  </DialogDescription>
                </DialogHeader>
                <ul className="flex-1 overflow-y-auto flex flex-col gap-3 h-[calc(100vh-300px)] pr-2">
                  {data.log.map((message) => (
                    <li key={message.id}>
                      <Message message={message.question} asTag="div" />
                      <Message message={message.answer} isUser asTag="div" />
                    </li>
                  ))}
                </ul>
              </DialogContent>
            )
          default:
            return null
        }
      }

      return (
        <Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">
                  {t('dashboard.table.actions.open')}
                </span>
                <MoreHorizontalIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                {t('dashboard.table.actions')}
              </DropdownMenuLabel>
              <DialogTrigger asChild>
                <DropdownMenuItem onClick={() => setDialogMenu('viewChat')}>
                  {t('dashboard.table.actions.viewChat')}
                </DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          {handleDialogMenu()}
        </Dialog>
      )
    }
  }
]

interface Props {
  surveyName: string
  data: SurveyResult[]
}

export function CandidatesTable({ surveyName, data }: Props) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState<any>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter
    }
  })

  const handleDownloadExcel = () => {
    const fileName = `${surveyName}-data`
    const exportType = exportFromJSON.types.xls

    exportFromJSON({
      data: data,
      fileName,
      exportType
    })
  }

  return (
    <div className="w-full">
      <div className="flex items-center py-4 justify-between">
        <Input
          placeholder={`${t('dashboard.table.filter')}...`}
          value={globalFilter}
          onChange={(event) => table.setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
        <div className="flex flex-col gap-2">
          <Button variant="ghost" onClick={handleDownloadExcel}>
            {t('dashboard.table.export')} .xlsx
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                {t('dashboard.table.columns')}
                <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }>
                      {/* @ts-expect-error all columns ids have a translation */}
                      {t(`dashboard.table.${column.id}`)}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center">
                  {t('dashboard.table.noResults')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}>
            {t('dashboard.table.previous')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}>
            {t('dashboard.table.next')}
          </Button>
        </div>
      </div>
    </div>
  )
}
