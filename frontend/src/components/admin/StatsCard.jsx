import { TrendingUp, TrendingDown } from "lucide-react";

/**
 * StatsCard Component
 * Reusable card for displaying statistics
 * 
 * @param {Object} props
 * @param {string} props.title - Card title
 * @param {string|number} props.value - Main value to display
 * @param {ReactNode} props.icon - Icon component
 * @param {number} props.growth - Growth percentage (optional)
 * @param {string} props.color - Color variant (primary, secondary, accent, success, warning, error)
 */
export default function StatsCard({ title, value, icon: Icon, growth, color = "primary" }) {
    const colorClasses = {
        primary: "bg-primary text-primary-content",
        secondary: "bg-secondary text-secondary-content",
        accent: "bg-accent text-accent-content",
        success: "bg-success text-success-content",
        warning: "bg-warning text-warning-content",
        error: "bg-error text-error-content",
        info: "bg-info text-info-content",
    };

    return (
        <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
            <div className="card-body">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <p className="text-sm opacity-70 mb-1">{title}</p>
                        <h3 className="text-3xl font-bold">{value}</h3>

                        {growth !== undefined && (
                            <div className="flex items-center gap-1 mt-2">
                                {growth >= 0 ? (
                                    <TrendingUp size={16} className="text-success" />
                                ) : (
                                    <TrendingDown size={16} className="text-error" />
                                )}
                                <span className={`text-sm font-medium ${growth >= 0 ? "text-success" : "text-error"}`}>
                                    {growth >= 0 ? "+" : ""}{growth}%
                                </span>
                                <span className="text-xs opacity-60 ml-1">vs last month</span>
                            </div>
                        )}
                    </div>

                    {Icon && (
                        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
                            <Icon size={24} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
