import React from 'react';

const BattleParametersPanel = ({
    swarmSize,
    setSwarmSize,
    attackerQubits,
    setAttackerQubits,
    isAttacking,
    startAttack,
    stopAttack,
    showWarning,
    setShowWarning,
    getSwarmZone,
    getQubitZone,
    text,
    SWARM_STRESS_THRESHOLD,
    QUBIT_STRESS_THRESHOLD
}) => {
    return (
        <div className="ui-overlay" style={{ top: 'auto', bottom: '20px', zIndex: 90 }}>
            {/* Header: Always visible, but simplified when attacking */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: isAttacking ? '0.5rem' : '1rem' }}>
                <h3 style={{ margin: 0, color: (swarmSize > SWARM_STRESS_THRESHOLD || attackerQubits > QUBIT_STRESS_THRESHOLD) ? 'var(--danger-color)' : 'white' }}>
                    {text.battle_params} {(swarmSize > SWARM_STRESS_THRESHOLD || attackerQubits > QUBIT_STRESS_THRESHOLD) && '⚠️'}
                </h3>

                {!isAttacking && (
                    <button
                        onClick={() => setShowWarning(true)}
                        style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            border: '1px solid #666',
                            color: '#666',
                            padding: 0,
                            fontSize: '14px',
                            marginTop: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'transparent',
                            cursor: 'pointer'
                        }}
                        title={text.warning_title}
                    >
                        ?
                    </button>
                )}
            </div>

            {/* Collapsible Content */}
            {!isAttacking && (
                <div className="animate-fade-in">
                    <label>
                        <span style={{ color: swarmSize > SWARM_STRESS_THRESHOLD ? 'var(--danger-color)' : 'inherit' }}>
                            {text.swarm_density} (N={new Intl.NumberFormat().format(swarmSize)})
                            <span style={{ display: 'block', fontSize: '0.7rem', opacity: 0.7, marginTop: '2px', color: swarmSize > SWARM_STRESS_THRESHOLD ? 'var(--danger-color)' : 'var(--primary-color)' }}>
                                {text.zone_label}: {getSwarmZone()}
                            </span>
                        </span>
                        <input
                            type="range"
                            min="100"
                            max="1000000"
                            step="100"
                            value={swarmSize}
                            onChange={(e) => {
                                stopAttack();
                                setSwarmSize(parseInt(e.target.value));
                            }}
                            style={{ accentColor: swarmSize > SWARM_STRESS_THRESHOLD ? 'var(--danger-color)' : 'var(--primary-color)' }}
                        />
                    </label>

                    <label style={{ marginTop: '1rem' }}>
                        <span style={{ color: attackerQubits > QUBIT_STRESS_THRESHOLD ? 'var(--danger-color)' : 'inherit' }}>
                            {text.attacker_qubits} ({new Intl.NumberFormat().format(attackerQubits)})
                            <span style={{ display: 'block', fontSize: '0.7rem', opacity: 0.7, marginTop: '2px', color: attackerQubits > QUBIT_STRESS_THRESHOLD ? 'var(--danger-color)' : 'var(--primary-color)' }}>
                                {text.zone_label}: {getQubitZone()}
                            </span>
                        </span>
                        <input
                            type="range"
                            min="0"
                            max="1000"
                            step="1"
                            value={(Math.log10(attackerQubits) - 2) * (1000 / 6)}
                            onChange={(e) => {
                                stopAttack();
                                const logVal = 2 + (parseFloat(e.target.value) / 1000) * 6;
                                setAttackerQubits(Math.round(Math.pow(10, logVal)));
                            }}
                            style={{ accentColor: attackerQubits > QUBIT_STRESS_THRESHOLD ? 'var(--danger-color)' : 'var(--primary-color)' }}
                        />
                    </label>
                </div>
            )}

            {/* Action Button: Always visible */}
            <button
                onClick={isAttacking ? stopAttack : startAttack}
                className={isAttacking ? 'danger-btn' : ''}
                style={{
                    borderColor: isAttacking ? 'var(--danger-color)' : 'var(--primary-color)',
                    marginTop: isAttacking ? '0' : '0.5rem' // Tighten layout when collapsed
                }}
            >
                {isAttacking ? text.reset : text.initiate}
            </button>

            {/* Footer / Quote: Hide when attacking to save space */}
            {!isAttacking && (
                <div style={{ marginTop: '0.5rem', fontSize: '0.7rem', color: '#666', lineHeight: '1.2' }}>
                    <div style={{ marginTop: '0.5rem', fontSize: '0.7rem', color: '#666', lineHeight: '1.2' }}>
                        {text.footer_1}
                        <br />{text.footer_2}
                        <div style={{ marginTop: '8px', color: 'var(--primary-color)', fontStyle: 'italic', fontWeight: 'bold' }}>
                            {text.catchphrase}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BattleParametersPanel;
