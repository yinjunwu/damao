import { useState } from 'react'

interface InvoiceDialogProps {
  open: boolean
  onClose: () => void
  selectedAmount: number
  selectedCount: number
}

export default function InvoiceDialog({
  open,
  onClose,
  selectedAmount,
}: InvoiceDialogProps) {
  const [invoiceAmount, setInvoiceAmount] = useState(selectedAmount.toFixed(2))
  const [feeItem, setFeeItem] = useState('信息技术服务')
  const [feeSubType, setFeeSubType] = useState('会员订阅')
  const [payerInfo, setPayerInfo] = useState('')
  const [invoiceType, setInvoiceType] = useState('增值税普通发票')
  const [emailReceive, setEmailReceive] = useState(false)
  const [emailAddress, setEmailAddress] = useState('')

  if (!open) return null

  const handleSubmit = () => {
    alert('发票申请已提交！')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[5vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative bg-white rounded-xl shadow-2xl w-[580px] max-h-[85vh] overflow-y-auto mx-4 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl flex items-center justify-between z-10">
          <h2 className="text-lg font-semibold text-gray-900">申请发票</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          {/* Amount Summary Card */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 space-y-2">
            <div className="flex items-baseline gap-1">
              <span className="text-sm text-gray-600">可开票金额</span>
              <span className="text-xl font-bold text-indigo-600">
                ¥{Number(invoiceAmount).toFixed(2)}
              </span>
            </div>
            <p className="text-xs text-gray-500">
              累计已消费金额 ¥{(selectedAmount + Math.random() * 100).toFixed(2)} - 欠款 ¥0.00 - 累计已开票金额 ¥0.00
            </p>
          </div>

          {/* Invoice Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1.5">
              <span className="text-red-500">*</span> 申请开票金额
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent">
              <span className="px-3 py-2 bg-gray-50 border-r border-gray-300 text-gray-600 font-medium">¥</span>
              <input
                type="number"
                step="0.01"
                min="50"
                max={selectedAmount}
                value={invoiceAmount}
                onChange={(e) => setInvoiceAmount(e.target.value)}
                placeholder="0.00"
                className="flex-1 px-3 py-2 text-sm focus:outline-none"
              />
            </div>
            {Number(invoiceAmount) < 50 && (
              <p className="mt-1 text-xs text-orange-600">最低开票金额为50元</p>
            )}
          </div>

          {/* Fee Item Name */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1.5">
              <span className="text-red-500">*</span> 费用项名称
            </label>
            <div className="flex gap-2">
              <select
                value={feeItem}
                onChange={(e) => setFeeItem(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option>信息技术服务</option>
                <option>技术服务费</option>
                <option>咨询服务费</option>
                <option>软件服务费</option>
              </select>
              <select
                value={feeSubType}
                onChange={(e) => setFeeSubType(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option>会员订阅</option>
                <option>商品购买</option>
              </select>
            </div>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-sm text-gray-500 font-medium">
                开票信息
              </span>
            </div>
          </div>

          {/* Payer Info */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1.5">
              <span className="text-red-500">*</span> 抬头名称和税号
            </label>
            <p className="text-xs text-gray-500 mb-2">
              根据我国税收相关政策要求，发票抬头需与实名认证主体名称一致，个人账号无法开具机构抬头发票；如有需要，您可以变更认证主体；若完成认证确有困难，且可以配合提供相应证明材料
            </p>
            <select
              value={payerInfo}
              onChange={(e) => setPayerInfo(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none cursor-pointer"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: 'right 12px center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '16px',
              }}
            >
              <option value="">请选择抬头</option>
              <option value="company">某某科技有限公司（税号：91110000XXXXXXXXXX）</option>
              <option value="personal">个人（张三，身份证：11010119900101XXXX）</option>
            </select>
          </div>

          {/* Invoice Type */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1.5">
              <span className="text-red-500">*</span> 发票类型
            </label>
            <select
              value={invoiceType}
              onChange={(e) => setInvoiceType(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none cursor-pointer"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: 'right 12px center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '16px',
              }}
            >
              <option>增值税普通发票</option>
              <option>增值税专用发票</option>
              <option>电子普通发票</option>
            </select>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-sm text-gray-500 font-medium">
                发票接收
              </span>
            </div>
          </div>

          {/* Email Receive */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={emailReceive}
                onChange={(e) => setEmailReceive(e.target.checked)}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
              <span className="text-sm text-gray-700">邮箱接收</span>
            </label>
            <p className="text-xs text-gray-500 pl-6">
              默认使用{' '}
              <a href="#" className="text-indigo-600 hover:underline">
                绑定邮箱
              </a>{' '}
              接收发票，如需使用其他邮箱请认真核对
            </p>
            {emailReceive && (
              <input
                type="email"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                placeholder="请输入接收发票的邮箱地址"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 rounded-b-xl flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            disabled={Number(invoiceAmount) < 50 || !payerInfo}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              Number(invoiceAmount) >= 50 && payerInfo
                ? 'bg-indigo-500 hover:bg-indigo-600 text-white'
                : 'bg-indigo-200 text-white cursor-not-allowed'
            }`}
          >
            提交申请
          </button>
        </div>
      </div>
    </div>
  )
}
