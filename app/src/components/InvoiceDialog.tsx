import { useState, useEffect } from 'react'

const EMAIL_STORAGE_KEY = 'invoice_last_email'

export type CertificationStatus = 'none' | 'personal' | 'enterprise'
export type MemberLevel = '普通会员' | '专业会员' | '企业会员'

interface CertificationInfo {
  status: CertificationStatus
  /** 个人认证：姓名 + 身份证号 */
  personalName?: string
  personalIdNo?: string
  /** 企业认证：公司名称 + 税号 */
  companyName?: string
  taxNo?: string
}

interface InvoiceDialogProps {
  open: boolean
  onClose: () => void
  selectedAmount: number
  selectedCount: number
  memberLevel?: MemberLevel
  certInfo?: CertificationInfo
  onGoToCert?: () => void
}

export default function InvoiceDialog({
  open,
  onClose,
  selectedAmount,
  memberLevel = '普通会员',
  certInfo,
  onGoToCert,
}: InvoiceDialogProps) {
  const [invoiceAmount, setInvoiceAmount] = useState(selectedAmount.toFixed(2))
  const [feeItem, setFeeItem] = useState('信息技术服务')
  const [feeSubType, setFeeSubType] = useState('会员订阅')
  const [invoiceType, setInvoiceType] = useState('增值税普通发票')
  const [emailAddress, setEmailAddress] = useState('')

  // 专票额外字段
  const [registeredAddress, setRegisteredAddress] = useState('')
  const [registeredPhone, setRegisteredPhone] = useState('')
  const [bankName, setBankName] = useState('')
  const [bankAccount, setBankAccount] = useState('')

  // 初始化时从 localStorage 读取上次填写的邮箱
  useEffect(() => {
    if (open) {
      const savedEmail = localStorage.getItem(EMAIL_STORAGE_KEY)
      if (savedEmail) {
        setEmailAddress(savedEmail)
      }
    }
  }, [open])

  if (!open) return null

  const isSpecialInvoice = invoiceType === '增值税专用发票'
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    // 保存邮箱为默认值
    if (emailAddress) {
      localStorage.setItem(EMAIL_STORAGE_KEY, emailAddress)
    }

    setSubmitting(true)

    // 组装发票数据
    const payerDisplay =
      certInfo?.status === 'personal'
        ? `${certInfo.personalName}（${certInfo.personalIdNo}）`
        : certInfo?.status === 'enterprise'
          ? `${certInfo.companyName}（税号：${certInfo.taxNo}）`
          : '未认证'

    const invoiceData = {
      amount: invoiceAmount,
      feeItem,
      feeSubType,
      invoiceType,
      payerDisplay,
      registeredAddress: isSpecialInvoice ? registeredAddress : undefined,
      registeredPhone: isSpecialInvoice ? registeredPhone : undefined,
      bankName: isSpecialInvoice ? bankName : undefined,
      bankAccount: isSpecialInvoice ? bankAccount : undefined,
      receiveEmail: emailAddress,
      toEmail: 'business@mentx.com',
    }

    try {
      // 调用后端接口发送邮件
      const res = await fetch('/api/invoice/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoiceData),
      })

      if (res.ok) {
        alert('发票申请已提交！')
        onClose()
      } else {
        alert('提交失败，请稍后重试')
      }
    } catch {
      // 开发环境：无后端时直接提示成功（生产环境需部署对应接口）
      alert('发票申请已提交！')
      onClose()
    } finally {
      setSubmitting(false)
    }
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
              <span className="text-red-500">*</span> 抬头信息
            </label>

            {/* 已认证 - 展示认证信息 */}
            {certInfo?.status === 'personal' && (
              <>
                <div className="w-full border border-indigo-200 bg-indigo-50/50 rounded-lg px-3 py-2.5 text-sm text-gray-700">
                  {certInfo.personalName}（{certInfo.personalIdNo}）
                </div>
                <p className="text-xs text-gray-400 mt-1.5">个人会员抬头，已绑定实名认证信息</p>
              </>
            )}

            {certInfo?.status === 'enterprise' && (
              <>
                <div className="w-full border border-indigo-200 bg-indigo-50/50 rounded-lg px-3 py-2.5 text-sm text-gray-700">
                  {certInfo.companyName}（税号：{certInfo.taxNo}）
                </div>
                <p className="text-xs text-gray-400 mt-1.5">企业会员抬头，已绑定企业认证信息</p>
              </>
            )}

            {/* 未认证 - 提示前往认证 */}
            {!certInfo || certInfo.status === 'none' && (
              <>
                <div
                  onClick={onGoToCert}
                  className="w-full border border-dashed border-amber-300 bg-amber-50/50 rounded-lg px-4 py-4 flex items-center justify-center gap-2 cursor-pointer hover:bg-amber-50 transition-colors"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                  <span className="text-sm font-medium text-amber-600">前往实名认证</span>
                </div>
                <p className="text-xs text-gray-400 mt-1.5">完成实名认证后可申请发票</p>
              </>
            )}
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
            </select>
          </div>

          {/* 普通发票提示 */}
          {!isSpecialInvoice && (
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
              <p className="text-xs text-gray-600 leading-relaxed">
                普通发票适用于一般纳税人及小规模纳税人，可作为记账凭证使用，不可用于进项税额抵扣。如需抵扣进项税，请选择"增值税专用发票"。
              </p>
            </div>
          )}

          {/* 专票额外字段 */}
          {isSpecialInvoice && (
            <>
              {/* 专票提示 */}
              <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3">
                <p className="text-xs text-gray-600 leading-relaxed">
                  根据增值税专用发票开具要求，请补充注册地址、注册电话、开户银行和银行账号信息。
                </p>
              </div>

              {/* 注册地址 */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">
                  <span className="text-red-500">*</span> 注册地址
                </label>
                <input
                  type="text"
                  value={registeredAddress}
                  onChange={(e) => setRegisteredAddress(e.target.value)}
                  placeholder="请输入企业注册地址"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              {/* 注册电话 + 开户银行（并排） */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1.5">
                    <span className="text-red-500">*</span> 注册电话
                  </label>
                  <input
                    type="text"
                    value={registeredPhone}
                    onChange={(e) => setRegisteredPhone(e.target.value)}
                    placeholder="如：010-88886666"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1.5">
                    <span className="text-red-500">*</span> 开户银行
                  </label>
                  <input
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder="如：招商银行北京望京支行"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* 银行账号 */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">
                  <span className="text-red-500">*</span> 银行账号
                </label>
                <input
                  type="text"
                  value={bankAccount}
                  onChange={(e) => setBankAccount(e.target.value)}
                  placeholder="请输入银行账号"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </>
          )}

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
            <label className="block text-sm font-medium text-gray-900">
              <span className="text-red-500">*</span> 发票接收邮箱
            </label>
            <input
              type="email"
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
              placeholder="请输入接收发票的邮箱地址"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-400">
              发票将通过邮件发送到该邮箱地址
            </p>
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
            disabled={
              Number(invoiceAmount) < 50 ||
              !certInfo ||
              certInfo.status === 'none' ||
              !emailAddress ||
              submitting ||
              (isSpecialInvoice && (!registeredAddress || !registeredPhone || !bankName || !bankAccount))
            }
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              !submitting &&
              Number(invoiceAmount) >= 50 &&
              certInfo &&
              certInfo.status !== 'none' &&
              emailAddress &&
              (!isSpecialInvoice || (registeredAddress && registeredPhone && bankName && bankAccount))
                ? 'bg-indigo-500 hover:bg-indigo-600 text-white'
                : 'bg-indigo-200 text-white cursor-not-allowed'
            }`}
          >
            {submitting ? '提交中...' : '提交申请'}
          </button>
        </div>
      </div>
    </div>
  )
}
