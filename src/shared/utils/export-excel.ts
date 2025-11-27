import * as XLSX from 'xlsx'

/**
 * Export data to Excel file
 * @param data Array of objects to export
 * @param filename Filename without extension
 * @param sheetName Optional sheet name (defaults to 'Data')
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function exportToExcel(data: any[], filename: string, sheetName: string = 'Data') {
  if (!data || data.length === 0) {
    console.error('No data to export')
    return
  }

  try {
    // Create worksheet from JSON data
    const ws = XLSX.utils.json_to_sheet(data)
    
    // Auto-size columns
    const cols = Object.keys(data[0]).map(key => ({
      wch: Math.max(
        key.length,
        ...data.map(row => String(row[key] || '').length)
      )
    }))
    ws['!cols'] = cols
    
    // Create workbook
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, sheetName)
    
    // Generate file
    const fileName = `${filename}-${new Date().toISOString().split('T')[0]}.xlsx`
    XLSX.writeFile(wb, fileName)
  } catch (error) {
    console.error('Error exporting to Excel:', error)
    throw new Error('Failed to export to Excel')
  }
}

/**
 * Export multiple sheets to a single Excel file
 * @param sheets Array of { name, data } objects
 * @param filename Filename without extension
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function exportToExcelMultiSheet(
  sheets: Array<{ name: string; data: any[] }>,
  filename: string
) {
  if (!sheets || sheets.length === 0) {
    console.error('No sheets to export')
    return
  }

  try {
    // Create workbook
    const wb = XLSX.utils.book_new()
    
    // Add each sheet
    sheets.forEach(sheet => {
      if (sheet.data && sheet.data.length > 0) {
        const ws = XLSX.utils.json_to_sheet(sheet.data)
        
        // Auto-size columns
        const cols = Object.keys(sheet.data[0]).map(key => ({
          wch: Math.max(
            key.length,
            ...sheet.data.map(row => String(row[key] || '').length)
          )
        }))
        ws['!cols'] = cols
        
        XLSX.utils.book_append_sheet(wb, ws, sheet.name)
      }
    })
    
    // Generate file
    const fileName = `${filename}-${new Date().toISOString().split('T')[0]}.xlsx`
    XLSX.writeFile(wb, fileName)
  } catch (error) {
    console.error('Error exporting to Excel:', error)
    throw new Error('Failed to export to Excel')
  }
}

