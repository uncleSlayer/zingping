"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { UserRound, Mail } from "lucide-react"

export type Friends = {
  id: string,
  email: string,
  name: string,
  imageUrl?: string
}

export const columns: ColumnDef<Friends>[] = [
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      const email = row.original.email
      return (
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          <span>{email}</span>
        </div>
      )
    }
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const name = row.original.name
      return (
        <div className="flex items-center gap-2">
          <UserRound className="h-4 w-4" />
          <span>{name}</span>
        </div>
      )
    }
  },
  {
    id: "status",
    header: "Status",
    cell: () => (
      <Badge
        variant="outline"
        className="bg-green-100 text-green-800"
      >
        Friend
      </Badge>
    )
  }
]
