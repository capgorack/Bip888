import React, { useState, useEffect, useRef } from 'react';
import SwarmVisualizer from './components/SwarmVisualizer';
import MetricsPanel from './components/MetricsPanel';
import NetworkImpactPanel from './components/NetworkImpactPanel';
import { translations } from './i18n';
import {
  QUBIT_FREQ_HZ,
  OPS_PER_CHECK,
  TARGET_BLOCK_TIME,
  SWARM_STRESS_THRESHOLD,
  QUBIT_STRESS_THRESHOLD
} from './constants';

const App = () => {
  const [swarmSize, setSwarmSize] = useState(1000);
  const [attackerQubits, setAttackerQubits] = useState(1000);
  const [isAttacking, setIsAttacking] = useState(false);
  const [attackProgress, setAttackProgress] = useState(0);
  const [realTxFound, setRealTxFound] = useState(false);
  const [timeToCrack, setTimeToCrack] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Status is now a logical KEY, not the display string
  // 'SECURE' | 'NEUTRALIZED' | 'CRACKING' | 'CRACKED'
  const [statusKey, setStatusKey] = useState('SECURE');
  const [opsPerSec, setOpsPerSec] = useState(0);

  // New States for UI Polish
  const [showWarning, setShowWarning] = useState(true);
  const [lang, setLang] = useState('en'); // 'en' | 'pt'

  const attackerRef = useRef(null);

  const text = translations[lang];
  // Derived display status
  const displayStatus = text.status_map[statusKey];

  // Helper for Swarm Zone
  const getSwarmZone = () => {
    if (swarmSize < 30000) return text.zone_swarm_1;
    if (swarmSize <= 150000) return text.zone_swarm_2;
    return text.zone_swarm_3;
  };

  // Helper for Qubit Zone
  const getQubitZone = () => {
    if (attackerQubits < 1000000) return text.zone_qubit_1;
    if (attackerQubits <= 20000000) return text.zone_qubit_2;
    return text.zone_qubit_3;
  };

  useEffect(() => {
    // 1. Calculate Total Computational Power
    const totalOpsPerSec = attackerQubits * QUBIT_FREQ_HZ;
    setOpsPerSec(totalOpsPerSec);

    // 2. Calculate Search Space Hardness (Grover's Algorithm)
    const nItems = swarmSize;
    const groverIterations = (Math.PI / 4) * Math.sqrt(nItems);

    // 3. Calculate Total Operations Needed (Reflecting complexity of SHA-256 Oracle)
    const totalOpsNeeded = groverIterations * OPS_PER_CHECK;

    // 4. Calculate Time to Crack
    let timeSeconds = totalOpsNeeded / totalOpsPerSec;
    setTimeToCrack(timeSeconds);

  }, [swarmSize, attackerQubits]);

  const startAttack = () => {
    if (isAttacking) return;
    setIsAttacking(true);
    setAttackProgress(0);
    setRealTxFound(false);
    setStatusKey('CRACKING');
    setElapsedTime(0);

    // Visual animation cap for extremely long scenarios
    let visualDuration = Math.min(timeToCrack * 1000, 30000);

    const startTime = Date.now();

    attackerRef.current = setInterval(() => {
      // 1. Update Attack Progress
      setAttackProgress(prev => {
        // If time to crack exceeds block persistence (600s), target is neutralized
        if (timeToCrack > TARGET_BLOCK_TIME) {
          setStatusKey('NEUTRALIZED');
          return Math.min(prev + 0.1, 99);
        }

        const elapsed = Date.now() - startTime;
        const progress = (elapsed / visualDuration) * 100;

        if (progress >= 100) {
          clearInterval(attackerRef.current);
          setIsAttacking(false);
          setRealTxFound(true);
          setStatusKey('CRACKED');
          return 100;
        }
        return progress;
      });

      // 2. Update Network Persistence Elapsed Time
      setElapsedTime(prev => {
        const trueElapsed = (Date.now() - startTime) / 1000;
        // Limit to 600s or timeToCrack
        return Math.min(trueElapsed, TARGET_BLOCK_TIME);
      });
    }, 16);
  };

  const stopAttack = () => {
    clearInterval(attackerRef.current);
    setIsAttacking(false);
    setAttackProgress(0);
    setStatusKey('SECURE');
    setRealTxFound(false);
    setElapsedTime(0);
  };

  const toggleLang = () => {
    setLang(prev => prev === 'en' ? 'pt' : 'en');
  };

  const getStatusColor = () => {
    if (statusKey === 'SECURE' || statusKey === 'NEUTRALIZED') return 'var(--primary-color)'; // Green
    if (statusKey === 'CRACKING') return '#FFD700'; // Gold
    return 'var(--danger-color)'; // Red
  };

  return (
    <div className="dashboard-container">
      {/* Warning Modal */}
      {showWarning && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 style={{ color: 'var(--primary-color)' }}>🛡️ {text.warning_title}</h2>
            <p style={{ whiteSpace: 'pre-line', textAlign: 'left', borderLeft: '2px solid var(--primary-color)', paddingLeft: '1rem', fontStyle: 'italic', fontSize: '0.9rem' }}>{text.warning_text}</p>
            <button className="modal-btn" onClick={() => setShowWarning(false)}>
              {text.accept_risk}
            </button>
          </div>
        </div>
      )}

      <header className="header">
        <div>
          <h1>BIP 888 <span>{text.title_sub}</span></h1>
          <div style={{ fontSize: '0.9rem', color: '#888', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {text.dashboard_title}
            <span>| {text.created_by} <strong>{text.author}</strong></span>
            <a href="https://github.com/capgorack" target="_blank" rel="noreferrer" className="git-link" style={{ marginLeft: '10px' }}>GitHub</a>
          </div>
        </div>

        <div className="header-controls">
          {/* Single Toggle Button */}
          <button
            className="lang-btn active"
            onClick={toggleLang}
            title="Switch Language / Mudar Idioma"
            style={{ cursor: 'pointer' }}
          >
            {lang === 'en' ? '🇧🇷 PT' : '🇺🇸 EN'}
          </button>

          <div className={`status-indicator ${isAttacking ? 'active' : ''}`}>
            {text.system_status}: <span style={{ color: getStatusColor() }}>{displayStatus}</span>
          </div>
        </div>
      </header>

      <main className="main-content">
        <SwarmVisualizer
          swarmSize={swarmSize}
          isAttacking={isAttacking}
          attackProgress={attackProgress}
          realTxFound={realTxFound}
        />

        <MetricsPanel
          swarmSize={swarmSize}
          isAttacking={isAttacking}
          timeToCrack={timeToCrack}
          status={displayStatus} // Pass translated string
          statusKey={statusKey} // Pass logical key for color
          qubits={attackerQubits}
          opsPerSec={opsPerSec}
          elapsedTime={elapsedTime}
          targetTime={TARGET_BLOCK_TIME}
          t={text} // Pass translations
        />

        <NetworkImpactPanel />

        <div className="ui-overlay" style={{ top: 'auto', bottom: '20px' }}>
          {/* Battle Parameters Header with Warning Recall */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, color: (swarmSize > SWARM_STRESS_THRESHOLD || attackerQubits > QUBIT_STRESS_THRESHOLD) ? 'var(--danger-color)' : 'white' }}>
              {text.battle_params} {(swarmSize > SWARM_STRESS_THRESHOLD || attackerQubits > QUBIT_STRESS_THRESHOLD) && '⚠️'}
            </h3>
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
          </div>

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

          <button
            onClick={isAttacking ? stopAttack : startAttack}
            className={isAttacking ? 'danger-btn' : ''}
            style={{ borderColor: isAttacking ? 'var(--danger-color)' : 'var(--primary-color)' }}
          >
            {isAttacking ? text.reset : text.initiate}
          </button>

          <div style={{ marginTop: '0.5rem', fontSize: '0.7rem', color: '#666', lineHeight: '1.2' }}>
            <div style={{ marginTop: '0.5rem', fontSize: '0.7rem', color: '#666', lineHeight: '1.2' }}>
              {text.footer_1}
              <br />{text.footer_2}
              <div style={{ marginTop: '8px', color: 'var(--primary-color)', fontStyle: 'italic', fontWeight: 'bold' }}>
                {text.catchphrase}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
