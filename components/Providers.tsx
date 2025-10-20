'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // 資料保持新鮮的時間 (5 分鐘)
            staleTime: 5 * 60 * 1000,
            // 快取資料的垃圾回收時間 (10 分鐘)
            gcTime: 10 * 60 * 1000,
            // 重新聚焦視窗時是否重新獲取資料
            refetchOnWindowFocus: false,
            // 網路重新連線時是否重新獲取資料
            refetchOnReconnect: true,
            // 重試邏輯
            retry: (failureCount, error) => {
              // 最多重試 2 次
              if (failureCount < 2) {
                // 如果是網路錯誤，則重試
                return (
                  error.message.includes('Network Error') ||
                  error.message.includes('timeout')
                );
              }
              return false;
            },
          },
          mutations: {
            // 預設不重試 mutations
            retry: false,
            // Mutation 的垃圾回收時間
            gcTime: 5 * 60 * 1000,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* 開發環境下顯示 React Query DevTools */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
