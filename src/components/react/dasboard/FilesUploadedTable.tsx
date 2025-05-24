import { useEffect, useState } from 'react'
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
import type { UploadedDocument } from '@/types'
import { getUiTranslations } from '@/i18n/utils'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/ui/dialog'
import { DialogTrigger } from '@radix-ui/react-dialog'
import { toast } from 'sonner'

const { t } = getUiTranslations()

interface Props {
  data: UploadedDocument[]
}

export function FilesUploadedTable({ data }: Props) {
  const [tableData, setTableData] = useState<UploadedDocument[]>(data)
  const columns: ColumnDef<UploadedDocument>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === 'asc')
            }>
            {t('dashboard.table.name')}
            <ArrowUpDown />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('name')}</div>
      )
    },
    {
      accessorKey: t('dashboard.table.actions'),
      enableHiding: false,
      cell: ({ row }) => {
        const [dialogMenu, setDialogMenu] = useState<string>('view')
        const data = row.original
        const handleDialogMenu = (): JSX.Element | null => {
          switch (dialogMenu) {
            case 'view':
              return (
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="capitalize">
                      {data.name}
                    </DialogTitle>
                  </DialogHeader>
                  {/* TODO ADD VIEW FILE */}
                </DialogContent>
              )
            case 'delete':
              toast.promise(
                fetch('/api/dashboard/documents', {
                  method: 'DELETE',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    files: [data.name]
                  })
                }),
                {
                  loading: t('dashboard.table.actions.deleting'),
                  success: () => {
                    setTableData((tableData) =>
                      tableData.filter((d) => d.name !== data.name)
                    )
                    return t('dashboard.table.actions.deleted')
                  },
                  error: () => {
                    return t('dashboard.table.actions.error')
                  }
                }
              )
              return null
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
                  <DropdownMenuItem onClick={() => setDialogMenu('view')}>
                    {t('dashboard.table.actions.view')}
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogTrigger asChild>
                  <DropdownMenuItem
                    onClick={() => setDialogMenu('delete')}
                    className="text-red-500">
                    {t('dashboard.table.actions.delete')}
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

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState<any>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const table = useReactTable({
    data: tableData,
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

  useEffect(() => {
    setTableData(data)
  }, [data])

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
