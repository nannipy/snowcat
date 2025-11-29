import { useMemo, useState } from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface TokenChartProps {
    color?: string;
    trend?: 'up' | 'down';
}

const TIME_RANGES = ['1H', '1D', '1W', '1M', '1Y'];

export function TokenChart({ color = '#22c55e', trend = 'up' }: TokenChartProps) {
    const [activeRange, setActiveRange] = useState('1D');

    // Generate chart data
    const data = useMemo(() => {
        const points = [];
        const count = 40;
        let value = 50;
        const seed = TIME_RANGES.indexOf(activeRange) * 1000;

        for (let i = 0; i < count; i++) {
            const bias = trend === 'up' ? 0.5 : -0.5;
            const noise = (Math.random() - 0.5 + bias * 0.2) * 5;
            value = Math.max(10, Math.min(90, value + noise));
            
            points.push({
                time: i,
                value: value,
                date: new Date(Date.now() - (count - i) * 3600000).toISOString() // Fake timestamps
            });
        }

        // Force trend
        if (trend === 'up') {
            points[0].value = Math.min(points[0].value, 30);
            points[points.length-1].value = Math.max(points[points.length-1].value, 70);
        } else {
            points[0].value = Math.max(points[0].value, 70);
            points[points.length-1].value = Math.min(points[points.length-1].value, 30);
        }
        
        return points;
    }, [activeRange, trend]);

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-surface/90 backdrop-blur border border-white/10 px-3 py-2 rounded-lg shadow-lg">
                    <p className="text-lg font-bold text-primary tracking-tight">
                        ${payload[0].value.toFixed(2)}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="w-full space-y-4">
            {/* Time Range Selector */}
            <div className="flex gap-2 justify-end">
                {TIME_RANGES.map((range) => (
                    <button
                        key={range}
                        onClick={(e) => { e.stopPropagation(); setActiveRange(range); }}
                        className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all ${
                            activeRange === range 
                                ? 'bg-primary/10 text-primary' 
                                : 'text-muted hover:text-primary'
                        }`}
                    >
                        {range}
                    </button>
                ))}
            </div>

            {/* Chart */}
            <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                                <stop offset="95%" stopColor={color} stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis 
                            dataKey="time" 
                            hide 
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis 
                            hide 
                            domain={['dataMin - 10', 'dataMax + 10']}
                        />
                        <Tooltip 
                            content={<CustomTooltip />}
                            cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: '4 4' }}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="value" 
                            stroke={color} 
                            strokeWidth={2}
                            fillOpacity={1} 
                            fill="url(#colorValue)" 
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
