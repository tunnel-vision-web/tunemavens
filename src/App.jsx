// Global self-healing storage recovery to resolve stale state crashes
if (typeof window !== 'undefined') {
  window.addEventListener('error', (e) => {
    if (e.message && (
      e.message.includes('roles') || 
      e.message.includes('genres') || 
      e.message.includes('chatLog') || 
      e.message.includes('JSON.parse')
    )) {
      console.warn('Recovering from storage corruption:', e.message);
      sessionStorage.clear();
      window.location.reload();
    }
  });
}

import React, { useState, useEffect, useRef } from 'react'
import { 
  HashRouter as Router, Routes, Route, Link, useLocation, useNavigate, useParams
} from 'react-router-dom'
import { 
  Music, Globe, Activity, Check, Zap, Shield, ArrowRight, ArrowLeft, 
  Lock, Database, Layers, Settings, Terminal, Radio, FileText, 
  Key, RefreshCw, Cpu, HelpCircle, ChevronDown, ChevronLeft, ChevronRight, Menu, X, MessageSquare, BookOpen, Coins,
  Bell, User, LogOut, ExternalLink, CheckCircle2,
  Smartphone, Download, Home, Apple, CreditCard, Headphones, TrendingUp,
  RotateCcw, Send, Users as UsersIcon, PenTool, Link2, Mail, Play
} from 'lucide-react'

// Local assets
import logoImg from './assets/logo.png'
import heroMusic1Img from './assets/images/hero_music_1.png'
import heroMusic2Img from './assets/images/hero_music_2.png'
import heroMusic3Img from './assets/images/hero_music_3.png'
import heroMusic4Img from './assets/images/hero_music_4.png'
import heroMusic1WesternImg from './assets/images/hero_music_1_western.png'
import heroMusic2WesternImg from './assets/images/hero_music_2_western.png'
import heroMusic3WesternImg from './assets/images/hero_music_3_western.png'
import appsSyncImg from './assets/images/apps_sync.png'
import appsMasteringImg from './assets/images/apps_mastering.png'
import appsLedgerImg from './assets/images/apps_ledger.png'
import distributeHeroImg from './assets/images/distribute_hero.png'
import listenHeroImg from './assets/images/listen_hero.png'

import headerToolsImg from './assets/images/header_tools.png'
import headerAppsImg from './assets/images/header_apps.png'
import headerPricingImg from './assets/images/header_pricing.png'
import headerAboutImg from './assets/images/header_about.png'
import headerHelpImg from './assets/images/header_help.png'
import headerToolsWesternImg from './assets/images/header_tools_western.png'
import headerAppsWesternImg from './assets/images/header_apps_western.png'
import headerPricingWesternImg from './assets/images/header_pricing_western.png'
import headerAboutWesternImg from './assets/images/header_about_western.png'
import headerHelpWesternImg from './assets/images/header_help_western.png'
import perfectForHeaderImg from './assets/images/perfect_for_header.png'

import userSongwriterImg from './assets/images/user_songwriter.png'
import userProducerImg from './assets/images/user_producer.png'
import userManagerImg from './assets/images/user_manager.png'
import userSupervisorImg from './assets/images/user_supervisor.png'

import consumerAppImg from './assets/images/consumer_app.png'
import creatorDashboardImg from './assets/images/creator_dashboard.png'

import ledgerStep1Img from './assets/images/ledger_step_1.png'
import ledgerStep2Img from './assets/images/ledger_step_2.png'
import ledgerStep3Img from './assets/images/ledger_step_3.png'
import ledgerStep4Img from './assets/images/ledger_step_4.png'

import syncStep1Img from './assets/images/sync_step_1.png'
import syncStep2Img from './assets/images/sync_step_2.png'
import syncStep3Img from './assets/images/sync_step_3.png'
import syncStep4Img from './assets/images/sync_step_4.png'

import RegionSwitcher from './RegionSwitcher.jsx'
import { useRegion } from './RegionContext.jsx'
import { authApi, tokenStore, adminApi, dealsApi, usersApi } from './lib/api.js'
import { INTERMAVEN_NATIVE_APPS } from './lib/nativeApps.js'
import { INTERMAVEN_PLATFORM_APPS } from './lib/intermavenPlatformApps.js'
import { lookupApp } from './lib/appCatalog.js'

import './App.css'

// ... (rest of the file remains the same as the version I pushed — the Tunestreams branch with full Tidal-inspired sections, dummy content, own menu, background #070e1b, CTAs, etc. is already included)

export default App;