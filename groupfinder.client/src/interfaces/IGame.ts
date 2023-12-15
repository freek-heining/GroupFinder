import { IUser } from "./IUser"
import { IRace } from "./IRace"
import { GameSystem } from "../enums/gameSystem.enum"

export interface IGame {
  gameId: number,
  title: string,
  date: Date,
  location: string,
  gameSystem: GameSystem,
  hostPlayerId: string,
  hostPlayer: IUser,
  hostPlayerRaceId: number,
  hostPlayerRace: IRace,
  guestPlayerId?: string,
  guestPlayer?: IUser,
  guestPlayerRaceId: number,
  guestPlayerRace?: IRace,
  deleted: boolean,
  reminderSet: boolean,
  played: boolean
}
