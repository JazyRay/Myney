'use client';

interface BalanceCardProps {
  balance: number;
  income: number;
  expense: number;
}

export default function BalanceCard({ balance, income, expense }: BalanceCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="relative overflow-hidden">
      {/* Main Balance Card */}
      <div className="bg-gradient-to-br from-[var(--primary)] via-purple-600 to-[var(--secondary)] rounded-3xl p-8 text-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative z-10">
          <p className="text-white/80 text-sm font-medium mb-2">Total Saldo</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-8">{formatCurrency(balance)}</h2>

          <div className="grid grid-cols-2 gap-4">
            {/* Income */}
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-green-400/30 rounded-xl flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-green-300">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m0 0l6.75-6.75M12 19.5l-6.75-6.75" />
                  </svg>
                </div>
                <span className="text-white/80 text-sm">Pendapatan</span>
              </div>
              <p className="text-xl md:text-2xl font-bold">{formatCurrency(income)}</p>
            </div>

            {/* Expense */}
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-red-400/30 rounded-xl flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-red-300">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75" />
                  </svg>
                </div>
                <span className="text-white/80 text-sm">Pengeluaran</span>
              </div>
              <p className="text-xl md:text-2xl font-bold">{formatCurrency(expense)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
