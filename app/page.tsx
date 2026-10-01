"use client";

import { useState, useMemo } from "react";
import Papa from "papaparse";
import { DollarSign, Tag, ListFilter, Upload, PieChart as PieIcon, Filter } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Transaction {
  Date?: string;
  Description?: string;
  Amount?: string | number;
  Category?: string;
  [key: string]: any;
}

interface CategoryChartData {
  name: string;
  value: number;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [chartData, setChartData] = useState<CategoryChartData[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [summary, setSummary] = useState<{ totalSpend: number; topCategory: string }>({
    totalSpend: 0,
    topCategory: "N/A",
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse<Transaction>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsedData = results.data;
        setTransactions(parsedData);
        setSelectedCategory("ALL"); // Reset filter on new upload
        processFinancialData(parsedData);
      },
    });
  };

  const processFinancialData = (data: Transaction[]) => {
    let total = 0;
    const categoryTotals: Record<string, number> = {};

    data.forEach((row) => {
      const amount = parseFloat(String(row.Amount || 0).replace(/[^0-9.-]+/g, ""));
      if (!isNaN(amount)) {
        total += amount;
        const category = row.Category || "Uncategorized";
        categoryTotals[category] = (categoryTotals[category] || 0) + amount;
      }
    });

    const formattedChartData: CategoryChartData[] = Object.entries(categoryTotals).map(
      ([name, value]) => ({
        name,
        value: parseFloat(value.toFixed(2)),
      })
    );

    let maxSpend = 0;
    let topCat = "N/A";
    formattedChartData.forEach((item) => {
      if (item.value > maxSpend) {
        maxSpend = item.value;
        topCat = item.name;
      }
    });

    setSummary({ totalSpend: total, topCategory: topCat });
    setChartData(formattedChartData);
  };

  // 1. Extract unique categories dynamically from uploaded data
  const uniqueCategories = useMemo(() => {
    const categories = new Set<string>();
    transactions.forEach((t) => {
      if (t.Category) categories.add(t.Category);
    });
    return Array.from(categories);
  }, [transactions]);

  // 2. Filter transactions based on the selected dropdown value
  const filteredTransactions = useMemo(() => {
    if (selectedCategory === "ALL") return transactions;
    return transactions.filter(
      (t) => (t.Category || "Uncategorized") === selectedCategory
    );
  }, [transactions, selectedCategory]);

  return (
    <main className="min-h-screen p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Financial Dashboard</h1>
        <p className="text-muted-foreground">Upload bank CSVs for instant parsing and visual insights.</p>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spending</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${summary.totalSpend.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Highest Spend Category</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.topCategory}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <ListFilter className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transactions.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* File Upload & Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-1 flex flex-col justify-center space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Upload className="h-5 w-5" /> Select Bank CSV File
          </h2>
          <Input type="file" accept=".csv" onChange={handleFileUpload} className="cursor-pointer" />
        </Card>

        {/* Pie Chart Card */}
        <Card className="p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <PieIcon className="h-5 w-5" /> Spending Breakdown
          </h2>
          {chartData.length > 0 ? (
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }: { name?: string; percent?: number }) =>
                      `${name || ""} (${((percent ?? 0) * 100).toFixed(0)}%)`
                    }
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any) =>
                      `$${parseFloat(String(value || 0)).toFixed(2)}`
                    }
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-72 flex items-center justify-center text-muted-foreground">
              Upload a CSV file to render chart visualization.
            </div>
          )}
        </Card>
      </div>

      {/* Filterable Data Table Section */}
      {transactions.length > 0 && (
        <Card className="p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl font-semibold">Parsed Transactions</h2>
            
            {/* Category Dropdown Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filter:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="h-9 w-[180px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="ALL">All Categories ({transactions.length})</option>
                {uniqueCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.Date || "N/A"}</TableCell>
                    <TableCell className="font-medium">{row.Description || "N/A"}</TableCell>
                    <TableCell>{row.Category || "Uncategorized"}</TableCell>
                    <TableCell className="text-right">
                      ${parseFloat(String(row.Amount || 0)).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}
    </main>
  );
}