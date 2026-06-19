import { HashRouter as BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import DowntimeDashboard from './pages/DowntimeDashboard'
import DowntimeLogger from './pages/DowntimeLogger'
import SalesDashboard from './pages/SalesDashboard'
import ImportData from './pages/ImportData'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/downtime" replace />} />
          <Route path="downtime" element={<DowntimeDashboard />} />
          <Route path="downtime/log" element={<DowntimeLogger />} />
          <Route path="sales" element={<SalesDashboard />} />
          <Route path="import" element={<ImportData />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
