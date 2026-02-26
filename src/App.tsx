import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  TrendingDown, 
  Users, 
  Package,
  Calendar,
  MoreHorizontal,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SubMaterialItem, ItemStatus } from './types';
import { MOCK_DATA } from './mockData';

export default function App() {
  const [items, setItems] = useState<SubMaterialItem[]>(MOCK_DATA);
  const [activeTab, setActiveTab] = useState<ItemStatus>(ItemStatus.INCOMPLETE);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesTab = item.status === activeTab;
      const matchesSearch = 
        item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.productCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.customerName.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [items, activeTab, searchTerm]);

  const stats = useMemo(() => {
    const incomplete = items.filter(i => i.status === ItemStatus.INCOMPLETE);
    const totalDiff = incomplete.reduce((acc, curr) => acc + curr.totalDifference, 0);
    return {
      incompleteCount: incomplete.length,
      totalDifferenceAmount: totalDiff,
      completedCount: items.length - incomplete.length
    };
  }, [items]);

  const toggleStatus = (id: string) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const newStatus = item.status === ItemStatus.INCOMPLETE ? ItemStatus.COMPLETED : ItemStatus.INCOMPLETE;
        return { ...item, status: newStatus, updatedAt: new Date().toISOString().split('T')[0] };
      }
      return item;
    }));
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1C1E] font-sans">
      {/* Header */}
      <header className="bg-white border-b border-[#E1E3E5] px-8 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="bg-[#1A1C1E] p-2 rounded-lg">
            <TrendingDown className="text-white w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">부자재 단차 관리 리포트</h1>
            <p className="text-xs text-[#6C757D] font-medium uppercase tracking-wider">Sub-material Price Variance Tracker</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right mr-4">
            <p className="text-[10px] text-[#6C757D] font-bold uppercase">Last Updated</p>
            <p className="text-xs font-mono">2026-02-26 15:39</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1A1C1E] text-white rounded-lg text-sm font-medium hover:bg-[#2D3135] transition-colors">
            <Download size={16} />
            SAP 데이터 업로드
          </button>
        </div>
      </header>

      <main className="p-8 max-w-[1600px] mx-auto space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-2xl border border-[#E1E3E5] shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-red-50 rounded-lg">
                <AlertCircle className="text-red-600 w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-1 rounded uppercase">Action Required</span>
            </div>
            <p className="text-sm text-[#6C757D] font-medium">미완료 건수</p>
            <h2 className="text-3xl font-bold mt-1">{stats.incompleteCount} <span className="text-sm font-normal text-[#6C757D]">SKUs</span></h2>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-2xl border border-[#E1E3E5] shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <RefreshCw className="text-blue-600 w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded uppercase">Potential Recovery</span>
            </div>
            <p className="text-sm text-[#6C757D] font-medium">총 차이 금액 (미완료)</p>
            <h2 className="text-3xl font-bold mt-1">₩{stats.totalDifferenceAmount.toLocaleString()}</h2>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-2xl border border-[#E1E3E5] shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-green-50 rounded-lg">
                <CheckCircle2 className="text-green-600 w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded uppercase">Processed</span>
            </div>
            <p className="text-sm text-[#6C757D] font-medium">완료 건수</p>
            <h2 className="text-3xl font-bold mt-1">{stats.completedCount} <span className="text-sm font-normal text-[#6C757D]">SKUs</span></h2>
          </motion.div>
        </div>

        {/* Controls & Table */}
        <div className="bg-white rounded-2xl border border-[#E1E3E5] shadow-sm overflow-hidden">
          {/* Table Header / Tabs */}
          <div className="px-6 py-4 border-b border-[#E1E3E5] flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex bg-[#F1F3F5] p-1 rounded-xl">
              <button 
                onClick={() => setActiveTab(ItemStatus.INCOMPLETE)}
                className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === ItemStatus.INCOMPLETE ? 'bg-white shadow-sm text-[#1A1C1E]' : 'text-[#6C757D] hover:text-[#1A1C1E]'}`}
              >
                미완료 리스트
              </button>
              <button 
                onClick={() => setActiveTab(ItemStatus.COMPLETED)}
                className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === ItemStatus.COMPLETED ? 'bg-white shadow-sm text-[#1A1C1E]' : 'text-[#6C757D] hover:text-[#1A1C1E]'}`}
              >
                완료 리스트
              </button>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#ADB5BD] w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="제품명, 코드, 고객사 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#F8F9FA] border border-[#E1E3E5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1A1C1E]/10 transition-all"
                />
              </div>
              <button className="p-2 border border-[#E1E3E5] rounded-xl hover:bg-[#F8F9FA] transition-colors">
                <Filter size={18} className="text-[#495057]" />
              </button>
            </div>
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8F9FA]">
                  <th className="px-6 py-4 text-[11px] font-bold text-[#6C757D] uppercase tracking-wider">제품 정보</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-[#6C757D] uppercase tracking-wider">매출 정보</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-[#6C757D] uppercase tracking-wider text-right">단가 분석</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-[#6C757D] uppercase tracking-wider text-right">차이 총액</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-[#6C757D] uppercase tracking-wider">담당자</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-[#6C757D] uppercase tracking-wider">고객사</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-[#6C757D] uppercase tracking-wider text-center">액션</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E1E3E5]">
                <AnimatePresence mode="popLayout">
                  {filteredItems.map((item) => (
                    <motion.tr 
                      key={item.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, x: activeTab === ItemStatus.INCOMPLETE ? 20 : -20 }}
                      className="hover:bg-[#F8F9FA] transition-colors group"
                    >
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-[#1A1C1E]">{item.productName}</span>
                          <span className="text-xs font-mono text-[#6C757D] mt-1">{item.productCode}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5">
                            <Calendar size={12} className="text-[#ADB5BD]" />
                            <span className="text-xs font-semibold">{item.salesYearMonth}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Package size={12} className="text-[#ADB5BD]" />
                            <span className="text-xs">{item.salesQuantity.toLocaleString()} EA</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex flex-col gap-1">
                          <div className="text-xs text-[#6C757D]">
                            매출: <span className="font-mono text-[#1A1C1E]">₩{item.subMaterialSalesPrice}</span>
                          </div>
                          <div className="text-xs text-[#6C757D]">
                            매입: <span className="font-mono text-[#1A1C1E]">₩{item.subMaterialPurchasePrice}</span>
                          </div>
                          <div className="text-xs font-bold text-red-600">
                            Diff: ₩{item.priceDifference}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <span className="text-sm font-bold text-[#1A1C1E]">₩{item.totalDifference.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-[#6C757D] w-8">영업</span>
                            <span className="text-xs font-medium">{item.salesManager}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-[#6C757D] w-8">구매</span>
                            <span className="text-xs font-medium">{item.purchaseManager}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-[#1A1C1E]">{item.customerAbbr}</span>
                            <span className="text-[10px] font-mono text-[#6C757D]">{item.customerCode}</span>
                          </div>
                          <span className="text-xs text-[#6C757D] mt-0.5 truncate max-w-[120px]">{item.customerName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <button 
                          onClick={() => toggleStatus(item.id)}
                          className={`p-2 rounded-lg transition-all ${
                            item.status === ItemStatus.INCOMPLETE 
                              ? 'text-green-600 hover:bg-green-50' 
                              : 'text-orange-600 hover:bg-orange-50'
                          }`}
                          title={item.status === ItemStatus.INCOMPLETE ? "완료 처리" : "미완료로 복구"}
                        >
                          {item.status === ItemStatus.INCOMPLETE ? (
                            <CheckCircle2 size={20} />
                          ) : (
                            <RefreshCw size={20} />
                          )}
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                {filteredItems.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="p-4 bg-[#F8F9FA] rounded-full">
                          <Search size={32} className="text-[#ADB5BD]" />
                        </div>
                        <p className="text-[#6C757D] font-medium">검색 결과가 없습니다.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Workflow Guide */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="bg-[#1A1C1E] text-white p-6 rounded-2xl flex flex-col justify-between h-full">
            <div>
              <h3 className="text-lg font-bold mb-2">업무 가이드</h3>
              <p className="text-sm text-white/60 leading-relaxed">부자재 단차 관리 프로세스를 준수하여 정확한 마감을 진행해 주세요.</p>
            </div>
            <div className="mt-8">
              <button className="flex items-center gap-2 text-sm font-bold group">
                상세 매뉴얼 보기
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E1E3E5] flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#F1F3F5] flex items-center justify-center text-xs font-bold">01</div>
              <h4 className="text-sm font-bold">데이터 분석 (구매팀)</h4>
            </div>
            <p className="text-xs text-[#6C757D] leading-relaxed">SAP 데이터를 기반으로 매입단가와 매출단가 차이를 확인하고, 실제 단차 여부를 검증합니다.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E1E3E5] flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#F1F3F5] flex items-center justify-center text-xs font-bold">02</div>
              <h4 className="text-sm font-bold">청구 확인 (마케팅팀)</h4>
            </div>
            <p className="text-xs text-[#6C757D] leading-relaxed">단차가 확인된 품목에 대해 고객사별 추가 청구 가능 여부를 담당자와 협의합니다.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E1E3E5] flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#F1F3F5] flex items-center justify-center text-xs font-bold">03</div>
              <h4 className="text-sm font-bold">최종 완료</h4>
            </div>
            <p className="text-xs text-[#6C757D] leading-relaxed">청구가 완료되거나 단차가 아닌 것으로 판명된 건은 '완료' 시트로 이동하여 마감합니다.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-8 py-6 border-t border-[#E1E3E5] bg-white mt-12">
        <div className="max-w-[1600px] mx-auto flex justify-between items-center">
          <p className="text-xs text-[#6C757D]">© 2026 Manufacturing ERP System. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-[#6C757D] hover:text-[#1A1C1E]">개인정보처리방침</a>
            <a href="#" className="text-xs text-[#6C757D] hover:text-[#1A1C1E]">시스템 문의</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
