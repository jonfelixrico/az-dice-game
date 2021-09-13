import { Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { EventBus, ofType } from '@nestjs/cqrs'
import { timer } from 'rxjs'
import { filter, map, mergeMap, take, takeUntil } from 'rxjs/operators'
import { ReadModelConsumedEvent } from 'src/read-model/read-model-consumed.event'
import { ReadModelSyncedEvent } from 'src/read-model/read-model-synced.event'
import { WriteModelPublishedEvent } from 'src/write-model/write-model-published.event'

const TIMER_EXPIRATION = 1000 * 30 // 30 secs

/**
 * Service that listens for `WriteModelPublishedEvents` and waits for their matching `ReadModelConsumedEvent`.
 * This produced a `ReadModelSyncedEvent` that represents that we have caught up to an event that we emitted ourselves in this
 * app instance.
 */
@Injectable()
export class CatchUpNotifierService implements OnApplicationBootstrap {
  constructor(private eventBus: EventBus) {}

  /**
   * Creates an observable that waits until a `ReadModelConsumedEvent` for the specified `pubEvent` has
   * been consumed by the read model. Will wait until 30 seconds has passed without consumption. Emits once.
   * @param pubEvent
   * @returns
   */
  private createConsumedEventObs(pubEvent: WriteModelPublishedEvent) {
    return this.eventBus.pipe(
      takeUntil(timer(TIMER_EXPIRATION)),
      ofType(ReadModelConsumedEvent),
      filter(({ payload }) => payload.id === pubEvent.payload.eventId),
      take(1),
      map(() => pubEvent)
    )
  }

  onApplicationBootstrap() {
    const { eventBus } = this

    eventBus
      .pipe(
        ofType(WriteModelPublishedEvent),
        mergeMap((evt) => this.createConsumedEventObs(evt))
      )
      .subscribe(({ payload }) => {
        eventBus.publish(new ReadModelSyncedEvent(payload.event))
      })
  }
}
