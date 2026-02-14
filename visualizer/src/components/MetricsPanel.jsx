import React from 'react';

const MetricsPanel = ({ swarmSize, isAttacking, timeToCrack, status, statusKey, qubits, opsPerSec, elapsedTime, targetTime, t }) => {
    // Calculate entropy factor (sqrt of swarm size)
    const entropyFactor = Math.sqrt(swarmSize).toFixed(2);
    const formattedSwarmSize = new Intl.NumberFormat().format(swarmSize);

    // Calculate Security Margin (T_search - 600)
    const securityMargin = timeToCrack - targetTime;
    const shieldingProgress = (elapsedTime / targetTime) * 100;

    const getStatusColor = () => {
        if (statusKey === 'SECURE' || statusKey === 'NEUTRALIZED') return 'var(--primary-color)';
        if (statusKey === 'CRACKING') return '#FFD700';
        return 'var(--danger-color)';
    };

    return (
        <div className="ui-overlay">
            <h3 style={{ borderBottom: '1px solid var(--primary-color)', paddingBottom: '0.5rem', marginTop: 0 }}>
                {t.metrics_title}
            </h3>

            <div className="stat-row">
                <span>{t.metric_swarm}:</span>
                <span className="stat-value">{formattedSwarmSize} Txs</span>
            </div>

            <div className="stat-row">
                <span>{t.metric_entropy}:</span>
                <span className="stat-value">x{entropyFactor}</span>
            </div>

            <div className="stat-row" title={t.sec_margin_check}>
                <span>{t.metric_target_window}:</span>
                <span className="stat-value" style={{ color: '#888' }}>{targetTime.toFixed(4)}s</span>
            </div>

            <div className="stat-row">
                <span>{t.metric_crack_time}:</span>
                <span className="stat-value" style={{ color: timeToCrack > targetTime ? 'var(--primary-color)' : 'var(--danger-color)' }}>
                    {timeToCrack === Infinity ? "∞" : timeToCrack.toFixed(4)}s
                </span>
            </div>

            <div className="stat-row" style={{ borderBottom: '1px dashed #333', paddingBottom: '0.5rem' }}>
                <span>{t.metric_margin}:</span>
                <span className="stat-value" style={{ color: securityMargin > 0 ? 'var(--primary-color)' : 'var(--danger-color)' }}>
                    {securityMargin === Infinity ? "∞" : (securityMargin > 0 ? '+' : '') + securityMargin.toFixed(2)}s
                </span>
            </div>

            <div className="stat-row" style={{ marginTop: '0.5rem' }}>
                <span>{t.metric_qubits}:</span>
                <span className="stat-value">{new Intl.NumberFormat().format(qubits)}</span>
            </div>

            <div className="stat-row">
                <span>{t.metric_ops}:</span>
                <span className="stat-value">{new Intl.NumberFormat().format(opsPerSec)}</span>
            </div>

            <div className="stat-row">
                <span>{t.metric_status}:</span>
                <span className="stat-value" style={{ color: getStatusColor(), textShadow: `0 0 10px ${getStatusColor()}` }}>
                    {status}
                </span>
            </div>

            {isAttacking && (
                <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#888' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span>{t.metric_shielding}</span>
                        <span>{elapsedTime.toFixed(1)}s / {targetTime}s</span>
                    </div>
                    <div style={{
                        width: '100%',
                        height: '6px',
                        background: '#1a1a1a',
                        border: '1px solid #333',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            width: `${shieldingProgress}%`,
                            height: '100%',
                            background: 'var(--primary-color)',
                            boxShadow: '0 0 10px var(--primary-color)',
                            transition: 'width 0.1s linear'
                        }} />
                    </div>
                    <div style={{ fontSize: '0.65rem', marginTop: '4px', opacity: 0.7 }}>
                        {t.sec_margin_check}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MetricsPanel;
