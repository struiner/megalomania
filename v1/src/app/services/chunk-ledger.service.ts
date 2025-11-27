import dayjs, { Dayjs } from 'dayjs';
import { LedgerEntry, LedgerEvent, TimeSpeed } from '../../shared/models/ledger.models';
import { Injectable } from '@angular/core';


@Injectable({ providedIn: 'root' })
export class ChunkLedgerService {
  pastLedgerEntries: LedgerEntry[] = [];
  futureLedgerEntries: LedgerEntry[] = [];
  currentTimestamp: Dayjs = dayjs('01-01-1880');
  private timer: any;
  private currentSpeed: TimeSpeed = TimeSpeed.MEDIUM;
  private direction: 1 | -1 = 1;

  start(): void {
    this.stop();
    this.timer = setInterval(() => this.tick(), this.currentSpeed);
  }

  stop(): void {
    if (this.timer) clearInterval(this.timer);
  }

  setSpeed(speed: TimeSpeed): void {
    this.currentSpeed = speed;
    this.start();
  }

  setDirection(direction: 1 | -1): void {
    this.direction = direction;
    this.start();
  }

  private async tick(): Promise<void> {
    if (this.direction === 1) {
      await this.moveForward();
    } else {
      await this.moveBackward();
    }
  }

  private async moveForward(amount = 15): Promise<void> {
    this.currentTimestamp = this.currentTimestamp.add(amount, 'minute');

    const currentEvents = this.futureLedgerEntries.filter(entry => entry.timestamp.isBefore(this.currentTimestamp));
    for (const entry of currentEvents) {
      entry.events.forEach(event => event.apply());
      this.pastLedgerEntries.push(entry);
    }
    this.futureLedgerEntries = this.futureLedgerEntries.filter(entry => !entry.timestamp.isAfter(this.currentTimestamp));
  }

  private async moveBackward(amount = 15): Promise<void> {
    const lastEntries = this.pastLedgerEntries.filter(entry => entry.timestamp.isAfter(this.currentTimestamp));
    if (lastEntries.length > 0) {
      for (const entry of lastEntries.reverse()) {
        entry.events.slice().reverse().forEach(event => event.reverse());
        this.futureLedgerEntries.push(entry);
        this.pastLedgerEntries.pop();
      }
    }

    this.currentTimestamp = this.currentTimestamp.subtract(amount, 'minute');
      }

  async recordEventAt<T>(event: LedgerEvent<T>, timestamp: Dayjs = this.currentTimestamp): Promise<void> {
    // if (!this.validateEvent(event)) {
    //   console.error('Imbalanced resourceDelta detected!');
    //   return;
    // }

    const entry: LedgerEntry = {
      timestamp,
      events: [event],
      hash: await this.calculateHash(event, timestamp),
    };

    if (timestamp.isBefore(this.currentTimestamp) || timestamp.isSame(this.currentTimestamp)) {
      event.apply();
      this.pastLedgerEntries.push(entry);
    } else {
      this.futureLedgerEntries.push(entry);
    }

    console.log(`Event \"${event.type}\" recorded at ${entry.timestamp.format('YYYY-MM-DD HH:mm')} (hash: ${entry.hash})`);
  }

  private validateEvent(event: LedgerEvent): boolean {
    const total = Object.values(event.resourceDelta).reduce((sum, val) => sum + val, 0);
    return total === 0;
  }

  private async calculateHash(event: LedgerEvent, timestamp: Dayjs): Promise<string> {
    const encoder = new TextEncoder();
    const eventString = JSON.stringify({
      type: event.type,
      description: event.description,
      payload: event.payload,
      resourceDelta: event.resourceDelta,
      timestamp: timestamp.toISOString(),
    });

    const data = encoder.encode(eventString);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);

    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  async setCurrentTimestamp(newTimestamp: Dayjs): Promise<void> {
    while (this.currentTimestamp.isBefore(newTimestamp)) {
      await this.moveForward(6000);
    }
    while (this.currentTimestamp.isAfter(newTimestamp)) {
      await this.moveBackward(6000);
    }
  }

  getEventsByType<T>(type: string): LedgerEvent<T>[] {
    return [...this.pastLedgerEntries, ...this.futureLedgerEntries]
      .flatMap(e => e.events)
      .filter(ev => ev.type === type);
  }
}