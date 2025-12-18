import dayjs from 'dayjs';
import { PlayerID } from '../models/anna-readme.models';
import {
  ResearchLedgerEvent,
} from '../models/ledger.models';
import { TechResearchPointer } from '../models/tech-tree.models';
import { TechLedgerService } from '../services/tech-ledger.service';

const techLedgerService = new TechLedgerService();

const defaultValidators: PlayerID[] = ['player_allied_validator'];

const northernLoggingPointer: TechResearchPointer = {
  techTreeId: 'northern_trade_v1',
  techTreeVersion: 1,
  nodeId: 'logging_outposts',
  cultureTags: ['biome_taiga', 'settlement_hamlet'],
};

const charcoalKilnsPointer: TechResearchPointer = {
  techTreeId: 'northern_trade_v1',
  techTreeVersion: 1,
  nodeId: 'charcoal_kilns',
  cultureTags: ['biome_taiga', 'guild_merchants'],
};

const riverTradingRitesPointer: TechResearchPointer = {
  techTreeId: 'northern_trade_v1',
  techTreeVersion: 1,
  nodeId: 'river_trading_rites',
  cultureTags: ['biome_beach', 'guild_merchants'],
};

export const techLedgerFixtures: ResearchLedgerEvent[] = [
  techLedgerService.createResearchStartEvent({
    researchId: 'research_logging_outposts_w1',
    tech: northernLoggingPointer,
    initiatedBy: 'player_north_coalition',
    validators: defaultValidators,
    timestamp: dayjs('1880-01-03T08:12:41Z'),
    source: 'player',
    initiatingCharacterId: 'charter_scribe_01',
  }),
  techLedgerService.createResearchCompleteEvent({
    researchId: 'research_charcoal_kilns_w1',
    tech: charcoalKilnsPointer,
    initiatedBy: 'player_north_coalition',
    validators: ['player_allied_validator', 'player_neighboring_fleet'],
    timestamp: dayjs('1880-01-05T15:20:12Z'),
    completionProof: 'proof_charcoal_kilns_merkle_root',
    completionNotes: 'Validated by allied validator; merchants guild supplied inputs.',
  }),
  techLedgerService.createResearchCancelledEvent({
    researchId: 'research_river_trading_rites_w2',
    tech: riverTradingRitesPointer,
    initiatedBy: 'player_north_coalition',
    validators: ['player_port_authority'],
    timestamp: dayjs('1880-01-06T09:55:58Z'),
    cancelledBy: 'player_north_coalition',
    reason: 'player_cancelled',
    cancellationNotes:
      'Cancelled after guild veto; keep ledger entry for cross-player audit.',
  }),
];
