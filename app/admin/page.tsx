"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DollarSign,
  Users,
  FileText,
  TrendingUp,
  Package,
  Activity,
  Receipt,
  ArrowUpRight,
} from "lucide-react";

export default function AdminPage() {
  const quotations = useQuery(api.quotations.listQuotations) || [];
  const invoices = useQuery(api.invoices.listInvoices) || [];
  const clients = useQuery(api.clients.listClients) || [];
  const services = useQuery(api.services.listServices) || [];

  // Calculate analytics
  const totalQuotations = quotations.length;
  const totalInvoices = invoices.length;
  const totalClients = clients.length;
  const totalServices = services.length;

  const totalRevenue = invoices.reduce((sum, inv) => {
    const totalAmount = parseFloat(String(inv.total || 0)) || 0;
    const paidAmount = parseFloat(String(inv.paidAmount || 0)) || 0;

    if (inv.status === "paid") {
      return sum + totalAmount;
    } else if (inv.status === "partially_paid") {
      return sum + paidAmount;
    }

    return sum;
  }, 0);

  const pendingQuotations = quotations.filter(
    (q) => q.status === "draft" || q.status === "sent"
  ).length;

  const paidInvoices = invoices.filter(
    (i) => i.status === "paid"
  ).length;

  const partiallyPaidInvoices = invoices.filter(
    (i) => i.status === "partially_paid"
  ).length;

  const activeQuotations = quotations.filter(
    (q) => q.status === "sent"
  ).length;

  // Combine quotations and invoices for recent activity
  const recentActivity = [
    ...quotations.map((q) => ({
      type: "quotation" as const,
      id: q._id,
      number: q.quotationNumber,
      client: q.toName || "Unknown",
      status: q.status,
      date: q.createdAt || 0,
      amount: q.total,
    })),
    ...invoices.map((i) => ({
      type: "invoice" as const,
      id: i._id,
      number: i.invoiceNumber,
      client: i.toName || "Unknown",
      status: i.status,
      date: i.createdAt || 0,
      amount: i.total,
    })),
  ].sort((a, b) => b.date - a.date);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400";

      case "partially_paid":
        return "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400";

      case "sent":
        return "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400";

      case "draft":
        return "bg-slate-100 text-slate-600 dark:bg-slate-500/15 dark:text-slate-400";

      case "overdue":
        return "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400";

      default:
        return "bg-gray-100 text-gray-600 dark:bg-gray-500/15 dark:text-gray-400";
    }
  };

  const statCards = [
    {
      title: "Total Revenue",
      value: new Intl.NumberFormat("en-KE", {
        style: "currency",
        currency: "KES",
      }).format(totalRevenue),
      description: "From paid & partially paid invoices",
      icon: DollarSign,
      color: "emerald",
      iconBg:
        "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
      border:
        "hover:border-emerald-200 dark:hover:border-emerald-500/30",
      glow: "group-hover:bg-emerald-500/5",
    },
    {
      title: "Quotations",
      value: totalQuotations,
      description: `${pendingQuotations} pending`,
      icon: FileText,
      color: "blue",
      iconBg:
        "bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
      border: "hover:border-blue-200 dark:hover:border-blue-500/30",
      glow: "group-hover:bg-blue-500/5",
    },
    {
      title: "Invoices",
      value: totalInvoices,
      description: `${paidInvoices} paid, ${partiallyPaidInvoices} partial`,
      icon: TrendingUp,
      color: "violet",
      iconBg:
        "bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400",
      border:
        "hover:border-violet-200 dark:hover:border-violet-500/30",
      glow: "group-hover:bg-violet-500/5",
    },
    {
      title: "Clients",
      value: totalClients,
      description: "Active clients",
      icon: Users,
      color: "orange",
      iconBg:
        "bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400",
      border:
        "hover:border-orange-200 dark:hover:border-orange-500/30",
      glow: "group-hover:bg-orange-500/5",
    },
    {
      title: "Services",
      value: totalServices,
      description: "Available services",
      icon: Package,
      color: "cyan",
      iconBg:
        "bg-cyan-100 text-cyan-600 dark:bg-cyan-500/15 dark:text-cyan-400",
      border:
        "hover:border-cyan-200 dark:hover:border-cyan-500/30",
      glow: "group-hover:bg-cyan-500/5",
    },
    {
      title: "Active Quotations",
      value: activeQuotations,
      description: "Awaiting response",
      icon: Activity,
      color: "pink",
      iconBg:
        "bg-pink-100 text-pink-600 dark:bg-pink-500/15 dark:text-pink-400",
      border:
        "hover:border-pink-200 dark:hover:border-pink-500/30",
      glow: "group-hover:bg-pink-500/5",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container mx-auto py-8 px-4 space-y-8">

        {/* Header */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>

            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Admin Dashboard
              </h1>
              <p className="text-sm text-muted-foreground">
                Overview of your business performance and activities
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/quotations"
            className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-blue-500/20 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/25"
          >
            <FileText className="h-4 w-4" />
            View Quotations
            <ArrowUpRight className="h-3.5 w-3.5 opacity-70 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>

          <Link
            href="/admin/invoices"
            className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-violet-500/20 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet-500/25"
          >
            <Receipt className="h-4 w-4" />
            View Invoices
            <ArrowUpRight className="h-3.5 w-3.5 opacity-70 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>

          <Link
            href="/admin/clients"
            className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-orange-500/20 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-500/25"
          >
            <Users className="h-4 w-4" />
            View Clients
            <ArrowUpRight className="h-3.5 w-3.5 opacity-70 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>

          <Link
            href="/admin/services"
            className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-cyan-500/20 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-500/25"
          >
            <Package className="h-4 w-4" />
            View Services
            <ArrowUpRight className="h-3.5 w-3.5 opacity-70 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Analytics Cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {statCards.map((stat) => {
            const Icon = stat.icon;

            return (
              <Card
                key={stat.title}
                className={`group relative overflow-hidden border-border/60 bg-card/80 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${stat.border}`}
              >
                {/* Subtle colored glow */}
                <div
                  className={`absolute inset-0 opacity-0 transition-opacity duration-300 ${stat.glow}`}
                />

                <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>

                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.iconBg}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                </CardHeader>

                <CardContent className="relative">
                  <div className="text-2xl font-bold tracking-tight">
                    {stat.value}
                  </div>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Activity */}
        <Card className="overflow-hidden border-border/60 bg-card/80 shadow-sm backdrop-blur-sm">
          <CardHeader className="border-b bg-gradient-to-r from-muted/40 to-transparent">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
                <p className="mt-1 text-xs text-muted-foreground">
                  Latest quotations and invoices
                </p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400">
                <Activity className="h-4 w-4" />
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-5">
            <div className="space-y-2">
              {recentActivity.map((activity) => (
                <div
                  key={`${activity.type}-${activity.id}`}
                  className="group flex items-center justify-between rounded-xl border border-transparent p-3 transition-all hover:border-border hover:bg-muted/40"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${activity.type === "quotation"
                        ? "bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400"
                        : "bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400"
                        }`}
                    >
                      {activity.type === "quotation" ? (
                        <FileText className="h-4 w-4" />
                      ) : (
                        <Receipt className="h-4 w-4" />
                      )}
                    </div>

                    <div>
                      <p className="font-medium">
                        {activity.type === "quotation"
                          ? "Quotation"
                          : "Invoice"}{" "}
                        #{activity.number}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        Client: {activity.client}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${getStatusStyle(
                        activity.status
                      )}`}
                    >
                      {activity.status.replace("_", " ")}
                    </span>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {activity.date
                        ? new Date(activity.date).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </div>
              ))}

              {recentActivity.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <Activity className="h-5 w-5 text-muted-foreground" />
                  </div>

                  <p className="text-sm font-medium">
                    No recent activity
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    New quotations and invoices will appear here.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
