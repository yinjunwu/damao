import { useState } from 'react'
import MemberInfoPanel from './MemberInfoPanel'
import TaskCenter from './TaskCenter'
import OrderManagement from './OrderManagement'

export type TabKey = 'cert' | 'coupon' | 'code' | 'discount' | 'upgrade' | 'task' | 'order'

function TabButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`pb-3 px-1 text-sm font-medium transition-colors relative cursor-pointer ${
        active ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'
      }`}
    >
      {label}
      {active && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />}
    </button>
  )
}

function EmptyPanel({ title }: { title: string }) {
  return (
    <div className="py-16 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14,2 14,8 20,8"/>
        </svg>
      </div>
      <p className="text-sm text-gray-400">{title}内容开发中...</p>
    </div>
  )
}

export interface OrderItem {
  id: string
  orderNo: string
  userId: string
  productName: string
  orderType: '虚拟商品购买' | '会员升级'
  status: '已完成' | '待支付' | '已取消'
  amount: number
  createTime: string
  canInvoice: boolean
}

const mockOrders: OrderItem[] = [
  {
    id: '1',
    orderNo: 'ORD20260414221147TJVIXG',
    userId: '855',
    productName: '3天高级会员特惠卡',
    orderType: '虚拟商品购买',
    status: '已完成',
    amount: 5,
    createTime: '2026/04/14 22:11',
    canInvoice: true,
  },
  {
    id: '2',
    orderNo: 'ORD202604082203570CXQBS',
    userId: '858',
    productName: '高级会员（月付）',
    orderType: '会员升级',
    status: '已完成',
    amount: 9.9,
    createTime: '2026/04/08 22:03',
    canInvoice: true,
  },
  {
    id: '3',
    orderNo: 'ORD20260408073843VW38DI',
    userId: '670',
    productName: '3天高级会员特惠卡',
    orderType: '虚拟商品购买',
    status: '已完成',
    amount: 5,
    createTime: '2026/04/08 07:38',
    canInvoice: true,
  },
  {
    id: '4',
    orderNo: 'ORD20260408073502H3CFQ5',
    userId: '654',
    productName: '高级会员（月付）',
    orderType: '会员升级',
    status: '已完成',
    amount: 9.9,
    createTime: '2026/04/08 07:35',
    canInvoice: true,
  },
  {
    id: '5',
    orderNo: 'ORD20260407182391KJQWXP',
    userId: '720',
    productName: '7天高级会员特惠卡',
    orderType: '虚拟商品购买',
    status: '已完成',
    amount: 12.5,
    createTime: '2026/04/07 18:23',
    canInvoice: true,
  },
  {
    id: '6',
    orderNo: 'ORD20260406144522PLMNOZ',
    userId: '891',
    productName: '高级会员（年付）',
    orderType: '会员升级',
    status: '已完成',
    amount: 99,
    createTime: '2026/04/06 14:45',
    canInvoice: true,
  },
]

export default function MemberCenter() {
  const [activeTab, setActiveTab] = useState<TabKey>('task')
  const [orders] = useState<OrderItem[]>(mockOrders)
  const [selectedOrderIds, setSelectedOrderIds] = useState<Set<string>>(new Set())

  return (
    <div className="max-w-[1400px] mx-auto p-6">
      {/* Header */}
      <div className="bg-white rounded-xl px-8 py-6 mb-6 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">会员中心</h1>
          <p className="text-gray-500 text-sm mt-1">管理您的会员信息和权益</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-medium transition-colors cursor-pointer">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 16v-4"/>
            <path d="M12 8h.01"/>
          </svg>
          会员体系介绍
        </button>
      </div>

      {/* Main Content */}
      <div className="flex gap-6">
        {/* Left Panel - Member Info */}
        <div className="w-[400px] flex-shrink-0">
          <MemberInfoPanel />
        </div>

        {/* Right Panel - Tab Content */}
        <div className="flex-1 bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 px-6 pt-5">
            <div className="flex gap-8">
              <TabButton key="cert" label="资格认证" active={activeTab === 'cert'} onClick={() => setActiveTab('cert')} />
              <TabButton key="coupon" label="权益券" active={activeTab === 'coupon'} onClick={() => setActiveTab('coupon')} />
              <TabButton key="code" label="兑换码" active={activeTab === 'code'} onClick={() => setActiveTab('code')} />
              <TabButton key="discount" label="优惠券" active={activeTab === 'discount'} onClick={() => setActiveTab('discount')} />
              <TabButton key="upgrade" label="会员升级" active={activeTab === 'upgrade'} onClick={() => setActiveTab('upgrade')} />
              <TabButton key="task" label="任务中心" active={activeTab === 'task'} onClick={() => setActiveTab('task')} />
              <TabButton key="order" label="购买记录" active={activeTab === 'order'} onClick={() => setActiveTab('order')} />
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'task' ? (
              <TaskCenter />
            ) : activeTab === 'order' ? (
              <OrderManagement
                orders={orders}
                selectedOrderIds={selectedOrderIds}
                setSelectedOrderIds={setSelectedOrderIds}
              />
            ) : (
              <EmptyPanel title={
                { cert: '资格认证', coupon: '权益券', code: '兑换码', discount: '优惠券', upgrade: '会员升级' }[activeTab] || ''
              } />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
