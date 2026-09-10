import React, { useState } from 'react';
import { Lock, Mail, Shield, Anchor, Ship, Navigation, ArrowRight, Layers } from 'lucide-react';

export type UserRole = 'port-service-provider' | 'tug-operator' | 'ship-agent' | 'harbour-pilot' | 'crane-operator';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleTitle: string;
  organization: string;
  avatarBg: string;
}

export const PRESET_USERS: UserProfile[] = [
  {
    id: 'u-1',
    name: 'Elena Vidal',
    email: 'elena.vidal@portdebarcelona.cat',
    role: 'port-service-provider',
    roleTitle: 'Port Authority Admin',
    organization: 'Autoritat Portuària de Barcelona',
    avatarBg: '#2563eb'
  },
  {
    id: 'u-2',
    name: 'Tomas Riera',
    email: 't.riera@msc-agency.com',
    role: 'ship-agent',
    roleTitle: 'Senior Shipping Agent',
    organization: 'Mediterranean Shipping Agency',
    avatarBg: '#059669'
  },
  {
    id: 'u-3',
    name: 'Laia Puig',
    email: 'laia.puig@boluda.com',
    role: 'tug-operator',
    roleTitle: 'Tug Fleet Dispatcher',
    organization: 'Boluda Towage Barcelona',
    avatarBg: '#d97706'
  },
  {
    id: 'u-4',
    name: 'Capt. Rodriguez',
    email: 'j.rodriguez@pilotstationbcn.es',
    role: 'harbour-pilot',
    roleTitle: 'Chief Harbour Pilot',
    organization: 'Corporació de Pràctics de Barcelona',
    avatarBg: '#7c3aed'
  },
  {
    id: 'u-5',
    name: 'Mateo Silva',
    email: 'm.silva@best-terminal.com',
    role: 'crane-operator',
    roleTitle: 'Senior Quay Crane Specialist',
    organization: 'BEST Container Terminal Barcelona',
    avatarBg: '#0891b2'
  }
];

export const findUserByEmail = (inputEmail: string): UserProfile => {
  const cleanInput = inputEmail.trim().toLowerCase();
  if (!cleanInput) return PRESET_USERS[0];

  const username = cleanInput.split('@')[0];

  // 1. Exact match
  let matched = PRESET_USERS.find(u => u.email.toLowerCase() === cleanInput);
  if (matched) return matched;

  // 2. Match by username (e.g. j.rodriguez, elena.vidal) regardless of domain TLD (.es, .com, .cat)
  if (username) {
    matched = PRESET_USERS.find(u => u.email.toLowerCase().split('@')[0] === username);
    if (matched) return matched;
  }

  // 3. Keyword / Role fallbacks
  if (cleanInput.includes('pilot') || cleanInput.includes('rodriguez') || cleanInput.includes('practic')) {
    return PRESET_USERS.find(u => u.role === 'harbour-pilot') || PRESET_USERS[0];
  }
  if (cleanInput.includes('tug') || cleanInput.includes('boluda') || cleanInput.includes('puig')) {
    return PRESET_USERS.find(u => u.role === 'tug-operator') || PRESET_USERS[0];
  }
  if (cleanInput.includes('agent') || cleanInput.includes('msc') || cleanInput.includes('riera')) {
    return PRESET_USERS.find(u => u.role === 'ship-agent') || PRESET_USERS[0];
  }
  if (cleanInput.includes('crane') || cleanInput.includes('best') || cleanInput.includes('silva')) {
    return PRESET_USERS.find(u => u.role === 'crane-operator') || PRESET_USERS[0];
  }
  if (cleanInput.includes('admin') || cleanInput.includes('vidal') || cleanInput.includes('port')) {
    return PRESET_USERS.find(u => u.role === 'port-service-provider') || PRESET_USERS[0];
  }

  return PRESET_USERS[0];
};

interface LoginPageProps {
  onLogin: (user: UserProfile) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState<string>(PRESET_USERS[0].email);
  const [password, setPassword] = useState<string>('••••••••••••');

  const currentMatchedUser = findUserByEmail(email);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(currentMatchedUser);
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'port-service-provider': return <Shield size={16} />;
      case 'ship-agent': return <Ship size={16} />;
      case 'tug-operator': return <Anchor size={16} />;
      case 'harbour-pilot': return <Navigation size={16} />;
      case 'crane-operator': return <Layers size={16} />;
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      {/* Background layer */}
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundImage: "linear-gradient(135deg, rgba(248, 250, 252, 0.88), rgba(226, 232, 240, 0.94)), url('/ship_bg.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        zIndex: -1
      }} />

      {/* Main Card Container */}
      <div style={{
        width: '100%',
        maxWidth: '460px',
        margin: '24px',
        backgroundColor: '#ffffff',
        borderRadius: '24px',
        boxShadow: '0 25px 60px -15px rgba(15, 23, 42, 0.15), 0 0 1px 1px rgba(0,0,0,0.05)',
        border: '1px solid rgba(226, 232, 240, 0.8)',
        padding: '40px',
        boxSizing: 'border-box'
      }}>
        {/* Logo & Header */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            backgroundColor: '#2563eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '14px',
            boxShadow: '0 8px 20px rgba(37,99,235,0.25)'
          }}>
            <Anchor size={26} color="white" />
          </div>
          <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.3px' }}>Port of Barcelona</h1>
          <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Smart Maritime Platform</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. elena.vidal@portdebarcelona.com"
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '13px',
                  color: '#0f172a',
                  backgroundColor: '#ffffff',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                required
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '13px',
                  color: '#0f172a',
                  backgroundColor: '#ffffff',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                required
              />
            </div>
          </div>

          <div style={{
            padding: '12px 14px',
            backgroundColor: '#f8fafc',
            borderRadius: '10px',
            border: '1px solid #e2e8f0',
            fontSize: '12px',
            color: '#475569',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <div style={{ color: currentMatchedUser.avatarBg, display: 'flex', flexShrink: 0 }}>
              {getRoleIcon(currentMatchedUser.role)}
            </div>
            <div>
              <strong>{currentMatchedUser.organization}</strong>
              <div style={{ fontSize: '11px', color: '#64748b' }}>Role: {currentMatchedUser.roleTitle}</div>
            </div>
          </div>

          <button
            type="submit"
            style={{
              marginTop: '8px',
              width: '100%',
              padding: '14px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: '#2563eb',
              color: 'white',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(37,99,235,0.3)',
              transition: 'background-color 0.2s'
            }}
          >
            <span>Sign In to Operational Portal</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '24px', textAlign: 'center' }}>
          Portic Maritime Network · Single Sign-On Verified
        </div>
      </div>
    </div>
  );
};

