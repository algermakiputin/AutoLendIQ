import { CheckCircle2, Clock, Activity } from 'lucide-react';

interface AgentAction {
  id: number;
  title: string;
  description: string;
  status: 'complete' | 'processing' | 'pending';
  timestamp: string;
  details: string;
}

interface AgentTimelineProps {
  actions: AgentAction[];
}

export function AgentTimeline({ actions }: AgentTimelineProps) {
  return (
    <div className="bg-white rounded-lg border border-[#e2e8f0] shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-white">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h3 className="mb-1">Agent Actions</h3>
            <p className="text-sm opacity-90">
              AI-powered verification timeline
            </p>
          </div>
        </div>
      </div>

      {/* Timeline Content */}
      <div className="p-6">
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-success"></div>

          {/* Timeline Items */}
          <div className="space-y-6">
            {actions.map((action, index) => {
              const isLast = index === actions.length - 1;

              return (
                <div key={action.id} className="relative">
                  {/* Timeline Node */}
                  <div className="flex items-start gap-4">
                    {/* Status Icon */}
                    <div className="relative z-10 flex-shrink-0">
                      {action.status === 'complete' && (
                        <div className="w-12 h-12 rounded-full bg-success text-white flex items-center justify-center shadow-lg ring-4 ring-white">
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                      )}
                      {action.status === 'processing' && (
                        <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center shadow-lg ring-4 ring-white animate-pulse">
                          <Clock className="w-6 h-6" />
                        </div>
                      )}
                      {action.status === 'pending' && (
                        <div className="w-12 h-12 rounded-full bg-secondary text-muted-foreground flex items-center justify-center ring-4 ring-white">
                          <Clock className="w-6 h-6" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pb-2">
                      {/* Card */}
                      <div
                        className={`
                          rounded-lg border transition-all duration-300
                          ${
                            action.status === 'complete'
                              ? 'bg-success/5 border-success/30 shadow-sm'
                              : action.status === 'processing'
                              ? 'bg-primary/5 border-primary/30 shadow-md'
                              : 'bg-background border-[#e2e8f0]'
                          }
                        `}
                      >
                        <div className="p-4">
                          {/* Title and Timestamp */}
                          <div className="flex items-start justify-between mb-2">
                            <h4
                              className={`
                                font-semibold
                                ${
                                  action.status === 'complete'
                                    ? 'text-success'
                                    : action.status === 'processing'
                                    ? 'text-primary'
                                    : 'text-muted-foreground'
                                }
                              `}
                            >
                              {action.title}
                            </h4>
                            {action.status === 'complete' && (
                              <span className="flex-shrink-0 px-2 py-1 rounded-md bg-success/20 text-success text-xs font-medium">
                                ✓ Verified
                              </span>
                            )}
                          </div>

                          {/* Description */}
                          <p className="text-sm text-muted-foreground mb-3">
                            {action.description}
                          </p>

                          {/* Details */}
                          {action.status === 'complete' && (
                            <div className="bg-white rounded-lg p-3 border border-[#e2e8f0]">
                              <p className="text-xs text-foreground">
                                {action.details}
                              </p>
                            </div>
                          )}

                          {/* Timestamp */}
                          <div className="flex items-center gap-2 mt-3">
                            <Clock className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {action.timestamp}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-8 pt-6 border-t border-[#e2e8f0]">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-semibold text-success mb-1">
                {actions.filter(a => a.status === 'complete').length}
              </div>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-primary mb-1">
                {actions.filter(a => a.status === 'processing').length}
              </div>
              <p className="text-xs text-muted-foreground">In Progress</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-muted-foreground mb-1">
                {actions.filter(a => a.status === 'pending').length}
              </div>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
