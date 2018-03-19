import {
  Injectable
} from '@angular/core';
import {
  HttpClient
} from '@angular/common/http';
import {
  Card
} from './shared/card';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class CardService {

  standardURL: string = 'https://deckofcardsapi.com/api/deck/';

  constructor(private http: HttpClient) {}

  drawFromDeck(deckID: string, numberOfCards: number): any {
    return this.http.get(this.standardURL + deckID + '/draw/?count=' + numberOfCards);
  }

  newDeck(): any {
    return this.http.get(this.standardURL + 'new/');
  }

  shuffleDeck(deckID: string): any {
    return this.http.get(this.standardURL + deckID + "/shuffle/");
  }

  addToPile(deckID: string, pileName: string, cardCodes: string): any {
    return this.http.get(this.standardURL + deckID + '/pile/' + pileName + '/add/?cards=' + cardCodes);
  }

  listPiles(deckID: string, pileName: string): any {
    return this.http.get(this.standardURL + deckID + '/pile/' + pileName + '/list');
  }

  drawFromPile(deckID: string, pileName: string, cardCodes: string): any {
    return this.http.get(this.standardURL + deckID + '/pile/' + pileName + '/draw/?cards=' + cardCodes)
  }
}