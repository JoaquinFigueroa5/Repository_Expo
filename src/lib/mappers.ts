import type { ApiTool, ApiLoan, ApiRequest, ApiCareer } from '../app/types'

export function mapApiToolToTool(t: ApiTool) {
  return {
    id: t.id,
    name: t.name,
    cat: t.cat,
    code: t.code,
    desc: t.desc || '',
    brand: t.brand || '',
    location: t.location,
    totalQty: t.totalQty,
    available: t.available,
    status: t.status === 'AVAILABLE' ? 'available' as const
           : t.status === 'IN_USE' ? 'in_use' as const
           : t.status === 'MAINTENANCE' ? 'maintenance' as const
           : 'reserved' as const,
    image: t.image || '',
    maxDays: t.maxDays,
    specs: (t.specs && typeof t.specs === 'object' && !Array.isArray(t.specs)
      ? Object.entries(t.specs).map(([k, v]) => ({ k, v: String(v) }))
      : []) as { k: string; v: string }[],
    careers: t.careers as string[],
  }
}

export function mapApiLoanToLoan(l: ApiLoan) {
  return {
    id: l.id,
    toolId: l.toolId,
    qty: l.qty,
    loanDate: l.loanDate,
    dueDate: l.dueDate,
    returnDate: l.returnDate,
    status: l.status === 'ACTIVE' ? 'active' as const
           : l.status === 'RETURNED' ? 'returned' as const
           : 'overdue' as const,
  }
}

export function mapApiRequestToAdminReq(r: ApiRequest) {
  const firstItem = r.items?.[0]
  return {
    id: r.id,
    toolId: firstItem?.toolId || 0,
    qty: r.items?.reduce((sum, item) => sum + item.qty, 0) || 1,
    startDate: firstItem?.startDate || r.reqDate,
    endDate: firstItem?.dueDate || r.reqDate,
    notes: r.notes || '',
    status: r.status === 'PENDING' ? 'pending' as const
           : r.status === 'APPROVED' ? 'approved' as const
           : 'rejected' as const,
    reqDate: r.reqDate,
    student: r.user?.name || '',
    career: r.user?.career || '',
  }
}

export function mapApiCareerToCareer(c: ApiCareer) {
  return {
    id: c.id,
    name: c.name,
    icon: c.icon || '🎓',
    color: c.color || '#6B7280',
  }
}
