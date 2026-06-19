import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://srluhpnmybeixqqmyanj.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNybHVocG5teWJlaXhxcW15YW5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAyMzEyMzEsImV4cCI6MjA5NTgwNzIzMX0.DJX_izG-nHLJQldIRQLhiqabUlN0S97jsRc99tSnyJc'
)

// ── Equipment ──────────────────────────────────────────────
export const getEquipment = async () => {
  const { data, error } = await supabase.from('equipment').select('*').order('equipment_id')
  if (error) throw new Error(error.message)
  return data
}

export const createEquipment = async (payload) => {
  const { data, error } = await supabase.from('equipment').insert(payload).select().single()
  if (error) throw new Error(error.message)
  return data
}

// ── Downtime ───────────────────────────────────────────────
export const getDowntimeLogs = async () => {
  const { data, error } = await supabase
    .from('downtime_logs')
    .select('*')
    .order('breakdown_datetime', { ascending: false })
  if (error) throw new Error(error.message)
  return data
}

export const getDowntimeSummary = async () => {
  const { data, error } = await supabase.rpc('get_downtime_summary')
  if (error) throw new Error(error.message)
  return data[0]
}

export const getDowntimeByEquipment = async () => {
  const { data, error } = await supabase.rpc('get_downtime_by_equipment')
  if (error) throw new Error(error.message)
  return data
}

export const createDowntimeLog = async (payload) => {
  const { data: eq, error: eqErr } = await supabase
    .from('equipment')
    .select('shop_name, machine_type')
    .eq('equipment_id', payload.equipment_id)
    .single()
  if (eqErr) throw new Error('Equipment not found')

  const downtime_hours = Math.round(
    ((new Date(payload.repair_datetime) - new Date(payload.breakdown_datetime)) / 3600000) * 100
  ) / 100
  if (downtime_hours <= 0) throw new Error('Repair time must be after breakdown time')

  const { count } = await supabase
    .from('downtime_logs')
    .select('*', { count: 'exact', head: true })
  const log_id = `DT${String((count || 0) + 1).padStart(3, '0')}`

  const { data, error } = await supabase
    .from('downtime_logs')
    .insert({
      log_id,
      equipment_id: payload.equipment_id,
      shop_name: eq.shop_name,
      machine_type: eq.machine_type,
      breakdown_datetime: payload.breakdown_datetime,
      repair_datetime: payload.repair_datetime,
      downtime_hours,
      root_cause: payload.root_cause,
      maintenance_cost: payload.maintenance_cost || 0,
      notes: payload.notes || null,
    })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data
}

// ── Sales ──────────────────────────────────────────────────
export const importSalesCSV = async (file) => {
  const text = await file.text()
  const lines = text.trim().split('\n')
  const headers = lines[0].split(',').map(h => h.trim().replace(/^﻿/, ''))

  const rows = lines.slice(1)
    .filter(l => l.trim())
    .map(line => {
      const vals = line.split(',').map(v => v.trim())
      const r = {}
      headers.forEach((h, i) => { r[h] = vals[i] || '' })
      return {
        sale_date: r['Date'],
        shop_name: r['Shop Name'],
        shop_id: r['Shop ID'] || null,
        product_category: r['Product Category'],
        product_name: r['Product Name'],
        quantity: parseInt(r['Quantity']) || 0,
        unit_price: parseFloat(r['Unit Price']) || 0,
        total_sales: parseFloat(r['Total Sales']) || 0,
        channel: r['Channel'],
        shift_manager: r['Shift Manager'] || null,
      }
    })

  const { error } = await supabase.from('sales').insert(rows)
  if (error) throw new Error(error.message)
  return { rows_imported: rows.length, rows_skipped: 0, message: `Import complete. ${rows.length} rows imported.` }
}

export const getSalesSummary = async () => {
  const { data, error } = await supabase.rpc('get_sales_summary')
  if (error) throw new Error(error.message)
  return data[0]
}

export const getSalesByShop = async () => {
  const { data, error } = await supabase.rpc('get_sales_by_shop')
  if (error) throw new Error(error.message)
  return data
}

export const getSalesByCategory = async () => {
  const { data, error } = await supabase.rpc('get_sales_by_category')
  if (error) throw new Error(error.message)
  return data
}

export const getSalesByChannel = async () => {
  const { data, error } = await supabase.rpc('get_sales_by_channel')
  if (error) throw new Error(error.message)
  return data
}

// ── Shops ──────────────────────────────────────────────────
export const getShops = async () => {
  const { data, error } = await supabase.from('shops').select('*').order('shop_id')
  if (error) throw new Error(error.message)
  return data
}

export default supabase
