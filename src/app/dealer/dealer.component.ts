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
  amountOptions: Array<string>;
  selectedAmount: string;
  cardsRemaining: string;
  hand: Array < Card > ;
  deckID: string;

  constructor(private cardService: CardService) {}

  ngOnInit() {
    this.allUsernames = new Array < string > ();
    this.selectedAmount = "1";
    this.userName = '';
    this.showUsernameInput = true;
    this.showNewOrJoin = false;
    this.showCards = false;
    this.amountOptions = ['1','2','3','4','5','6'];
    this.hand = new Array < Card > ();
    this.cardsRemaining = '';
    this.deckID = '';
    this.backOfCardImage = 'https://cdn.shopify.com/s/files/1/0200/7616/products/' +
      'playing-cards-bicycle-rider-back-2_grande.png?v=1494193481';
  }

  selectNew() {
    this.cardService.newDeck().subscribe(data => {
      this.deckID = data.deck_id;
      this.cardService.drawFromDeck(this.deckID, '0').subscribe(data => {
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
    this.cardService.drawFromDeck(this.deckID, '0').subscribe(data => {
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
        if (!this.hand.map(x => x.code).includes(card.code)) {
          this.hand.push({
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
    this.cardService.drawFromDeck(this.deckID, this.selectedAmount).subscribe(data => {
      for (let card of data.cards) {
        let imageURL = card.image;
        imageURL = imageURL.replace('http://', 'https://');
        this.hand.push({
          image: imageURL,
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
      this.update();
    });
  }

  handleCardClick(cardIndex: number): void {
    if (this.hand[cardIndex].revealed) {
      this.discardCard(cardIndex);
    } else {
      this.revealCard(cardIndex);
    }
  }

  revealCard(cardIndex: number): void {
    this.hand[cardIndex].revealed = true;
  }

  revealAll() {
    for (let card of this.hand) {
      card.revealed = true;
    }
    this.update();
  }

  discardCard(cardIndex: number): void {
    this.hand.splice(cardIndex, 1);
  }

  shuffleDeck() {
    this.cardService.shuffleDeck(this.deckID).subscribe(data => {
      this.update();
      this.hand.splice(0);
    });
  }

  clearHand() {
    this.hand.splice(0);
    this.update();
  }

  setUserName() {
    this.showUsernameInput = false;
    this.showNewOrJoin = true;
  }

  setSelectedAmount(selectedAmount: string) {
    console.log(selectedAmount);
    this.selectedAmount = selectedAmount;
  }

  goBack() {
    this.showUsernameInput = false;
    this.showJoin = false;
    this.showCards = false;
    this.showNewOrJoin = true;
    this.hand.splice(0);
    this.allUsernames.splice(0);
    this.cardsRemaining = '';
    this.deckID = '';
    this.selectedAmount = '1';
  }

  update() {
      this.cardService.listPiles(this.deckID, this.userName).subscribe(data => {
        this.getPileNames(data);
        this.cardsRemaining = data.remaining;
      });
  }
}