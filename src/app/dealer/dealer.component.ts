import {
  Component,
  OnInit
} from '@angular/core';
import {
  CardService
} from '../card.service';
import {
  Card
} from '../shared/card';
import {
  Observable
} from 'rxjs/Observable';

@Component({
  selector: 'app-dealer',
  templateUrl: './dealer.component.html',
  styleUrls: ['./dealer.component.css']
})
export class DealerComponent implements OnInit {

  showUsernameInput: boolean;
  showNewOrJoin: boolean;
  showJoin: boolean;
  showCards: boolean;

  userName: string;
  allUsernames: Array < string > ;
  backOfCardImage: string;

  requestedAmountOfCards: string;
  cardsRemaining: string;
  myPile: Array < Card > ;
  deckID: string;

  constructor(private cardService: CardService) {}

  ngOnInit() {
    this.allUsernames = new Array < string > ();
    this.userName = '';
    this.showUsernameInput = true;
    this.showNewOrJoin = false;
    this.showCards = false;
    this.requestedAmountOfCards = '';
    this.myPile = new Array < Card > ();
    this.cardsRemaining = '';
    this.deckID = '';
    this.backOfCardImage = 'http://cdn.shopify.com/s/files/1/0200/7616/products/' +
      'playing-cards-bicycle-rider-back-2_grande.png?v=1494193481';
  }

  selectNew() {
    this.cardService.newDeck().subscribe(data => {
      this.deckID = data.deck_id;
      this.cardService.drawFromDeck(this.deckID, 0).subscribe(data => {
        this.cardService.addToPile(this.deckID, this.userName, '').subscribe(data => {
          this.cardService.listPiles(this.deckID, this.userName).subscribe(data => {
            this.getPileNames(data);
            this.cardsRemaining = data.remaining;
            this.showNewOrJoin = false;
            this.showCards = true;
          });
        });
      });
    });
  }

  selectJoin() {
    this.showNewOrJoin = false;
    this.showJoin = true;
  }

  joinDeck() {
    this.cardService.drawFromDeck(this.deckID, 0).subscribe(data => {
      this.cardsRemaining = data.remaining;
      this.cardService.addToPile(this.deckID, this.userName, '').subscribe(data => {
        this.cardService.listPiles(this.deckID, this.userName).subscribe(data => {
          this.getPileNames(data);
          this.showJoin = false;
          this.showCards = true;
        });
      });
    });
  }

  getPileNames(data: any) {
    this.allUsernames.splice(0);
    for (let name in data.piles) {
      if (name != 'discard')
        this.allUsernames.push(name);
    }
  }

  listMyPile() {
    this.cardService.listPiles(this.deckID, this.userName).subscribe(data => {
      this.getPileNames(data);
      for (let card of data.piles[this.userName].cards) {
        if (!this.myPile.map(x => x.code).includes(card.code)) {
          this.myPile.push({
            image: card.image,
            value: card.value,
            suit: card.suit,
            code: card.code,
            revealed: false
          });
        }
      }
    });
  }

  drawCards(): void {
    this.cardService.drawFromDeck(this.deckID, parseInt(this.requestedAmountOfCards)).subscribe(data => {
      for (let card of data.cards) {
        this.myPile.push({
          image: card.image,
          value: card.value,
          suit: card.suit,
          code: card.code,
          revealed: false
        });
      }
      let cardCodes: string = '';
      for (let card of data.cards) {
        if (cardCodes.length > 0) {
          cardCodes += ',';
        }
        cardCodes += card.code;
      }
      this.cardsRemaining = data.remaining;
      this.cardService.listPiles(this.deckID, this.userName).subscribe(data => {
        this.getPileNames(data);
      });
    });
  }

  handleCardClick(cardIndex: number): void {
    if (this.myPile[cardIndex].revealed) {
      this.discardCard(cardIndex);
    } else {
      this.revealCard(cardIndex);
    }
  }

  revealCard(cardIndex: number): void {
    this.myPile[cardIndex].revealed = true;
  }

  discardCard(cardIndex: number): void {
    this.myPile.splice(cardIndex, 1);
  }

  shuffleDeck() {
    this.cardService.shuffleDeck(this.deckID).subscribe(data => {
      this.cardsRemaining = data.remaining;
      this.myPile.splice(0);
    });
  }

  setUserName() {
    this.showUsernameInput = false;
    this.showNewOrJoin = true;
  }
}