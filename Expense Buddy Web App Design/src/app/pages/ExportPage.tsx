import React, { useState } from 'react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Label } from '@/app/components/ui/label';
import { useApp } from '@/context/AppContext';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { Download, FileText, Calendar } from 'lucide-react';
import { Input } from '@/app/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';

export const ExportPage: React.FC = () => {
  const { transactions, categories } = useApp();
  const [exportFormat, setExportFormat] = useState('csv');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const exportToCSV = (data: any[]) => {
    if (data.length === 0) {
      toast.error('No transactions to export');
      return;
    }

    const headers = ['Date', 'Time', 'Type', 'Category', 'Amount', 'Notes'];
    const csvContent = [
      headers.join(','),
      ...data.map(t =>
        [
          t.date,
          t.time,
          t.type,
          t.category,
          t.amount,
          `"${t.notes.replace(/"/g, '""')}"`,
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expense-buddy-transactions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast.success('Transactions exported successfully!');
  };

  const exportToPDF = (data: any[]) => {
    if (data.length === 0) {
      toast.error('No transactions to export');
      return;
    }

    // Create a simple HTML representation
    const totalIncome = data.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = data.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Expense Buddy - Transaction Report</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; }
          h1 { color: #1F2937; }
          .summary { margin: 20px 0; padding: 20px; background: #F7F8FA; border-radius: 8px; }
          .summary-item { display: inline-block; margin-right: 40px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { padding: 12px; text-align: left; border-bottom: 1px solid #E5E7EB; }
          th { background: #F7F8FA; color: #1F2937; font-weight: bold; }
          .income { color: #10B981; }
          .expense { color: #EF4444; }
        </style>
      </head>
      <body>
        <h1>Expense Buddy - Transaction Report</h1>
        <p>Generated on: ${new Date().toLocaleString()}</p>
        
        <div class="summary">
          <div class="summary-item">
            <strong>Total Income:</strong> <span class="income">$${totalIncome.toFixed(2)}</span>
          </div>
          <div class="summary-item">
            <strong>Total Expenses:</strong> <span class="expense">$${totalExpenses.toFixed(2)}</span>
          </div>
          <div class="summary-item">
            <strong>Balance:</strong> $${(totalIncome - totalExpenses).toFixed(2)}
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Type</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            ${data.map(t => `
              <tr>
                <td>${new Date(t.date).toLocaleDateString()}</td>
                <td>${t.time}</td>
                <td class="${t.type}">${t.type}</td>
                <td>${t.category}</td>
                <td class="${t.type}">$${t.amount.toFixed(2)}</td>
                <td>${t.notes}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expense-buddy-report-${new Date().toISOString().split('T')[0]}.html`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast.success('Report exported successfully! Open the HTML file in a browser and print to PDF.');
  };

  const handleExport = () => {
    let filteredData = [...transactions];

    // Filter by date range
    if (startDate) {
      filteredData = filteredData.filter(t => new Date(t.date) >= new Date(startDate));
    }
    if (endDate) {
      filteredData = filteredData.filter(t => new Date(t.date) <= new Date(endDate));
    }

    // Filter by category
    if (filterCategory !== 'all') {
      filteredData = filteredData.filter(t => t.category === filterCategory);
    }

    // Sort by date (newest first)
    filteredData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (exportFormat === 'csv') {
      exportToCSV(filteredData);
    } else {
      exportToPDF(filteredData);
    }
  };

  const filteredCount = (() => {
    let count = transactions.length;
    if (startDate) {
      count = transactions.filter(t => new Date(t.date) >= new Date(startDate)).length;
    }
    if (endDate && startDate) {
      count = transactions.filter(
        t => new Date(t.date) >= new Date(startDate) && new Date(t.date) <= new Date(endDate)
      ).length;
    }
    if (filterCategory !== 'all') {
      count = transactions.filter(
        t => t.category === filterCategory &&
        (!startDate || new Date(t.date) >= new Date(startDate)) &&
        (!endDate || new Date(t.date) <= new Date(endDate))
      ).length;
    }
    return count;
  })();

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-[#1F2937] mb-2">Export Data</h1>
        <p className="text-[#6B7280]">Download your transaction data in various formats</p>
      </motion.div>

      <Card className="p-8 border-[#E5E7EB]">
        <div className="space-y-6">
          {/* Export Format */}
          <div className="space-y-2">
            <Label htmlFor="format">Export Format</Label>
            <Select value={exportFormat} onValueChange={setExportFormat}>
              <SelectTrigger className="border-[#E5E7EB]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    CSV (Excel Compatible)
                  </div>
                </SelectItem>
                <SelectItem value="pdf">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    PDF Report (HTML)
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Range */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Date Range (Optional)
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-sm text-[#6B7280]">
                  From
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border-[#E5E7EB]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-sm text-[#6B7280]">
                  To
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border-[#E5E7EB]"
                />
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <Label htmlFor="category">Filter by Category (Optional)</Label>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="border-[#E5E7EB]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.name}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                      {cat.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Preview */}
          <div className="p-4 bg-[#F7F8FA] rounded-lg border border-[#E5E7EB]">
            <p className="text-sm text-[#6B7280] mb-2">Preview</p>
            <p className="font-semibold text-[#1F2937]">
              {filteredCount} transaction{filteredCount !== 1 ? 's' : ''} will be exported
            </p>
            {(startDate || endDate) && (
              <p className="text-sm text-[#6B7280] mt-1">
                Date range: {startDate || 'Start'} to {endDate || 'End'}
              </p>
            )}
            {filterCategory !== 'all' && (
              <p className="text-sm text-[#6B7280] mt-1">
                Category: {filterCategory}
              </p>
            )}
          </div>

          {/* Export Button */}
          <Button
            onClick={handleExport}
            disabled={transactions.length === 0 || filteredCount === 0}
            className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white py-6 rounded-xl shadow-lg"
          >
            <Download className="w-5 h-5 mr-2" />
            Export {exportFormat.toUpperCase()}
          </Button>
        </div>
      </Card>

      {/* Info Card */}
      <Card className="p-6 border-[#E5E7EB] bg-[#3B82F6]/5">
        <h3 className="font-semibold text-[#1F2937] mb-2">Export Information</h3>
        <ul className="space-y-2 text-sm text-[#6B7280]">
          <li>• CSV files can be opened in Excel, Google Sheets, or any spreadsheet application</li>
          <li>• PDF reports are generated as HTML files - open in browser and print to PDF</li>
          <li>• All exported data includes transaction details, amounts, and notes</li>
          <li>• Use date filters to export specific time periods</li>
        </ul>
      </Card>
    </div>
  );
};
