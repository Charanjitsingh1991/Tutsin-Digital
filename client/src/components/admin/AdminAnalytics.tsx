import { useQuery } from '@tanstack/react-query';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { apiRequest } from '@/lib/queryClient';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Eye,
  Clock,
  MousePointer,
  Globe,
  Calendar
} from 'lucide-react';

interface AnalyticsOverview {
  summary: {
    totalViews: number;
    totalUniqueVisitors: number;
    avgBounceRate: number;
    avgSessionDuration: number;
  };
  topPages: Array<{
    page: string;
    views: number;
  }>;
  topReferrers: Array<{
    referrer: string;
    visits: number;
  }>;
  dailyMetrics: Array<{
    date: string;
    totalViews: number;
    uniqueVisitors: number;
    bounceRate: number;
    avgSessionDuration: number;
  }>;
  period: {
    startDate: string;
    endDate: string;
  };
}

export function AdminAnalytics() {
  const { token } = useAdminAuth();
  
  const { data: analytics, isLoading } = useQuery<AnalyticsOverview>({
    queryKey: ['/api/analytics/overview'],
    queryFn: () => apiRequest('GET', '/api/analytics/overview', undefined, {
      Authorization: `Bearer ${token}`
    }),
    enabled: !!token,
  });

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
            <p className="text-muted-foreground">Website performance and visitor insights</p>
          </div>
        </div>
        <div className="animate-pulse space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
          <p className="text-muted-foreground">
            Website performance and visitor insights
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          Last 30 days
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.summary.totalViews?.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground">
              Page views in the last 30 days
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.summary.totalUniqueVisitors?.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground">
              Individual visitors
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.summary.avgBounceRate || 0}%</div>
            <p className="text-xs text-muted-foreground">
              Average bounce rate
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Session</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatDuration(analytics?.summary.avgSessionDuration || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Average session duration
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Detailed Analytics */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Top Pages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Top Pages</span>
            </CardTitle>
            <CardDescription>
              Most visited pages in the last 30 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics?.topPages?.length ? (
                analytics.topPages.map((page, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{page.page || 'Homepage'}</p>
                        <p className="text-xs text-muted-foreground">
                          {page.views} views
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary">{page.views}</Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No page data available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Referrers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="h-5 w-5" />
              <span>Top Referrers</span>
            </CardTitle>
            <CardDescription>
              Traffic sources in the last 30 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics?.topReferrers?.length ? (
                analytics.topReferrers.map((referrer, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          {referrer.referrer || 'Direct'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {referrer.visits} visits
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary">{referrer.visits}</Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No referrer data available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Daily Metrics</span>
          </CardTitle>
          <CardDescription>
            Daily website performance over the last 7 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics?.dailyMetrics?.length ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Date</th>
                      <th className="text-right py-2">Views</th>
                      <th className="text-right py-2">Visitors</th>
                      <th className="text-right py-2">Bounce Rate</th>
                      <th className="text-right py-2">Avg. Session</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.dailyMetrics.map((metric, index) => (
                      <tr key={index} className="border-b hover:bg-muted/50">
                        <td className="py-2 font-medium">
                          {new Date(metric.date).toLocaleDateString()}
                        </td>
                        <td className="text-right py-2">{metric.totalViews}</td>
                        <td className="text-right py-2">{metric.uniqueVisitors}</td>
                        <td className="text-right py-2">{metric.bounceRate}%</td>
                        <td className="text-right py-2">
                          {formatDuration(metric.avgSessionDuration)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No daily metrics available</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Insights</CardTitle>
          <CardDescription>
            Key insights and recommendations based on your analytics data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-800 dark:text-green-400">
                  Good Traffic Growth
                </h4>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Your website is receiving consistent traffic. Consider creating more content to maintain this growth.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Eye className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-800 dark:text-blue-400">
                  Page Performance
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Your top pages are performing well. Focus on optimizing these pages for better conversion rates.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <Clock className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-orange-800 dark:text-orange-400">
                  Session Duration
                </h4>
                <p className="text-sm text-orange-700 dark:text-orange-300">
                  Consider adding more engaging content to increase average session duration.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

