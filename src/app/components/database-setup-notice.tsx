import { AlertCircle, Database, ExternalLink } from 'lucide-react';

interface DatabaseSetupNoticeProps {
  projectId: string;
}

export function DatabaseSetupNotice({ projectId }: DatabaseSetupNoticeProps) {
  const supabaseUrl = `https://supabase.com/dashboard/project/${projectId}`;

  return (
    <div className="bg-warning/10 border-2 border-warning rounded-lg p-6 mb-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-warning/20 rounded-lg flex items-center justify-center flex-shrink-0">
          <Database className="w-6 h-6 text-warning" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-warning" />
            <h3 className="font-semibold text-warning">Database Setup Required</h3>
          </div>
          <p className="text-sm text-foreground mb-4">
            To use AutoLend IQ with real data persistence, you need to create the database tables in your Supabase dashboard.
          </p>
          <div className="space-y-3">
            <div className="bg-white rounded-lg p-4 border border-[#e2e8f0]">
              <p className="text-sm font-medium text-foreground mb-2">📋 Setup Steps:</p>
              <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Open your Supabase dashboard (link below)</li>
                <li>Navigate to <strong>SQL Editor</strong></li>
                <li>Create a new query</li>
                <li>Copy the SQL from <code className="bg-secondary px-2 py-1 rounded text-xs">/supabase/SETUP_INSTRUCTIONS.md</code></li>
                <li>Run the query to create all tables</li>
              </ol>
            </div>
            
            <a
              href={supabaseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm"
            >
              Open Supabase Dashboard
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
