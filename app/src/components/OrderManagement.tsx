import { useState, useMemo } from 'react'
import InvoiceDialog from './InvoiceDialog'
import type { OrderItem } from './MemberCenter'

interface OrderManagementProps {
  orders: OrderItem[]
  selectedOrderIds: Set<string>
  setSelectedOrderIds: (ids: Set<string>) => void
}

export default function OrderManagement({
  orders,
  selectedOrderIds,
  setSelectedOrderIds,
}: OrderManagementProps) {
  const [statusFilter, setStatusFilter] = useState('全部')
  const [searchKeyword, setSearchKeyword] = useState('')
  const [showInvoiceDialog, setShowInvoiceDialog] = useState(false)

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      if (statusFilter !== '全部' && order.status !== statusFilter) return false
      if (
        searchKeyword &&
        !order.orderNo.toLowerCase().includes(searchKeyword.toLowerCase()) &&
        !order.productName.toLowerCase().includes(searchKeyword.toLowerCase())
      )
        return false
      return true
    })
  }, [orders, statusFilter, searchKeyword])

  // Selection handlers
  const toggleSelectOrder = (orderId: string) => {
    const newSet = new Set(selectedOrderIds)
    if (newSet.has(orderId)) {
      newSet.delete(orderId)
    } else {
      newSet.add(orderId)
    }
    setSelectedOrderIds(newSet)
  }

  const toggleSelectAll = () => {
    if (selectedOrderIds.size === filteredOrders.length) {
      setSelectedOrderIds(new Set())
    } else {
      setSelectedOrderIds(new Set(filteredOrders.map((o) => o.id)))
    }
  }

  // Selected orders for invoice
  const selectedOrdersForInvoice = orders.filter((o) =>
    selectedOrderIds.has(o.id),
  )
  const selectedTotalAmount = selectedOrdersForInvoice.reduce(
    (sum, o) => sum + o.amount,
    0,
  )
  const canApplyInvoice = selectedTotalAmount >= 50

  // Reset filters
  const handleReset = () => {
    setStatusFilter('全部')
    setSearchKeyword('')
  }

  return (
    <div>
      {/* Toolbar: filters left, actions right */}
      <div className="flex items-center justify-between mb-5 gap-4">
        {/* 左侧：筛选条件 */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option>全部</option>
            <option>已完成</option>
            <option>待支付</option>
            <option>已取消</option>
          </select>
          <div className="relative flex-1 max-w-xs">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="搜索订单号/商品名..."
              className="w-full border border-gray-300 rounded-lg pl-8 pr-8 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            {searchKeyword && (
              <button
                onClick={() => setSearchKeyword('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                title="清除"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* 右侧：操作按钮 */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {selectedOrderIds.size > 0 && (
            <button
              onClick={() => setShowInvoiceDialog(true)}
              disabled={!canApplyInvoice}
              title={canApplyInvoice ? '申请开票' : '金额不足50元'}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                canApplyInvoice
                  ? 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
              开票{selectedOrderIds.size > 0 && `(${selectedOrderIds.size})`}
            </button>
          )}
          <button
            onClick={() => window.location.reload()}
            className="p-1.5 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
            title="刷新"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
            </svg>
          </button>
          <button className="p-1.5 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer" title="导出订单">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
          </button>
          {(statusFilter !== '全部' || searchKeyword) && (
            <button
              onClick={handleReset}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              title="重置筛选条件"
            >
              重置
            </button>
          )}
        </div>
      </div>

      {/* Order Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-3 font-medium text-gray-600 w-12">
                <input
                  type="checkbox"
                  checked={
                    filteredOrders.length > 0 &&
                    selectedOrderIds.size === filteredOrders.length
                  }
                  onChange={toggleSelectAll}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
              </th>
              <th className="text-left py-3 px-3 font-medium text-gray-600">订单号</th>
              <th className="text-left py-3 px-3 font-medium text-gray-600">商品名称</th>
              <th className="text-left py-3 px-3 font-medium text-gray-600">订单状态</th>
              <th className="text-left py-3 px-3 font-medium text-gray-600">实付金额</th>
              <th className="text-left py-3 px-3 font-medium text-gray-600">创建时间</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-3 px-3">
                  <input
                    type="checkbox"
                    checked={selectedOrderIds.has(order.id)}
                    onChange={() => toggleSelectOrder(order.id)}
                    disabled={!order.canInvoice || order.status !== '已完成'}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
                    title={!order.canInvoice ? '该订单不支持开票' : ''}
                  />
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center gap-1">
                    <span className="text-gray-800">{order.orderNo}</span>
                    <button className="cursor-pointer opacity-60 hover:opacity-100" title="复制">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                      </svg>
                    </button>
                  </div>
                </td>
                <td className="py-3 px-3 text-gray-800">{order.productName}</td>
                <td className="py-3 px-3">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded text-xs font-medium ${
                      order.status === '已完成'
                        ? 'bg-green-50 text-green-600'
                        : order.status === '待支付'
                        ? 'bg-orange-50 text-orange-600'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="py-3 px-3 font-semibold text-red-500">
                  ¥{order.amount.toFixed(1)}
                </td>
                <td className="py-3 px-3 text-gray-600">{order.createTime}</td>
              </tr>
            ))}
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan={6} className="py-12 text-center text-gray-400">
                  暂无订单数据
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Selected info bar */}
      {selectedOrderIds.size > 0 && (
        <div className="mt-4 flex items-center justify-between bg-indigo-50 border border-indigo-200 rounded-lg px-4 py-3">
          <span className="text-sm text-indigo-700">
            已选择 <strong>{selectedOrderIds.size}</strong> 个订单，合计金额：
            <strong className="text-base ml-1">¥{selectedTotalAmount.toFixed(2)}</strong>
            {!canApplyInvoice && (
              <span className="ml-2 text-orange-600 text-xs">(最低开票金额50元)</span>
            )}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setShowInvoiceDialog(true)}
              disabled={!canApplyInvoice}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                canApplyInvoice
                  ? 'bg-indigo-500 hover:bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              申请开票
            </button>
            <button
              onClick={() => setSelectedOrderIds(new Set())}
              className="px-4 py-1.5 rounded-md text-sm font-medium border border-gray-300 hover:bg-white transition-colors cursor-pointer"
            >
              取消选择
            </button>
          </div>
        </div>
      )}

      {/* Invoice Dialog */}
      {showInvoiceDialog && (
        <InvoiceDialog
          open={showInvoiceDialog}
          onClose={() => setShowInvoiceDialog(false)}
          selectedAmount={selectedTotalAmount}
          selectedCount={selectedOrdersForInvoice.length}
        />
      )}
    </div>
  )
}
