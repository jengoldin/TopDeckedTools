export interface PlayerStats {
    id: string;
    life: number;
    color: string;
    cmdDam: Array<number>;
    history: Array<string>;
    other: {
        infect: number;
        energy: number;
        monarch: boolean;
        cityBless: boolean;
    };
}

import { Component, Input } from '@angular/core';
// import { NavParams } from '@ionic/angular';
import { isNullOrUndefined } from 'util';
import { Router, ActivatedRoute } from '@angular/router';
import { SettingsPage } from '../settings/settings';
import { SettingsPageModule } from '../settings/settings.module';
import { ModalController } from '@ionic/angular';

@Component({
    selector: 'page-life',
    templateUrl: 'counter.html',
    styleUrls: ['counter.scss'],
})
export class CounterPage {
    @Input() startingLife: number;
    @Input() numPlayers: number;
    @Input() timer: number;
    @Input() pickFirstPlayer: boolean;
    players: Array<PlayerStats>;
    displaySettings: boolean;

    constructor(
        // private navParams: NavParams,
        private router: Router,
        public modalController: ModalController,
        private route: ActivatedRoute
    ) {
        this.route.queryParamMap.subscribe(() => {
            if (this.router.getCurrentNavigation().extras.state) {
                let data = this.router.getCurrentNavigation().extras.state;
                this.startingLife = data.startingLife;
                this.numPlayers = data.numPlayers;
                this.timer = data.timer;
                this.pickFirstPlayer = data.pickFirstPlayer;
            }
        });

        this.players = [];
        this.displaySettings = false;
    }

    ionViewDidLeave() {
        this.numPlayers = undefined;
        this.players = undefined;
    }

    ionViewWillEnter() {
        // console.table(this.navParams);
        // let data = this.navParams.data;

        for (let i = 0; i < this.numPlayers; i++) {
            this.players.push({
                id: 'Player' + (i + 1),
                life: this.startingLife,
                color: this.getColor(),
                cmdDam: [],
                history: [],
                other: {
                    infect: 0,
                    energy: 0,
                    monarch: false,
                    cityBless: false,
                },
            });
        }
        console.table(this.players);
        // console.log('Players: ' + JSON.stringify(this.players));
    }

    ionViewDidEnter() {
        if (this.numPlayers === undefined) {
            console.log('Back');
            this.router.navigate(['/tabs/life']);
        }
    }

    setHistory(player: PlayerStats) {
        var shift: number;
        shift = player.life - parseInt(player.history[player.history.length - 1]);
        // if (shift > 0) {
        //     hist = '+' + shift;
        // } else {
        //     hist = shift.toString();
        // }
        // player.history.push(hist);
        player.history.push(player.life.toString());
    }

    getColor(): string {
        let colors = [
            // red
            '#dc2054',
            // orange
            '#f0583b',
            // tangerine
            '#f29a2c',
            // yellow
            '#e6c72f',
            // lime
            '#a4d53f',
            // green
            '#6fd872',
            // aqua
            '#56c9ab',
            // sky
            '#51a8e7',
            // blue
            '#597fdd',
            // purple
            '#8260ed',
            // magenta
            '#aa4ee0',
            // pink
            '#dc2054',
            // hot pink
            '#e0379d',
            // light pink
            '#f38aae',
        ];
        var color: string;
        do {
            color = colors[Math.floor(Math.random() * colors.length)];
            for (let i = 0; i < this.players.length; i++) {
                if (this.players[i].color === color) {
                    color = null;
                }
            }
        } while (isNullOrUndefined(color));
        return color;
    }

    incrementLife(player: PlayerStats) {
        player.life += 1;
        this.setHistory(player);
    }

    decrementLife(player: PlayerStats) {
        player.life -= 1;
        this.setHistory(player);
    }

    settings() {
        this.displaySettings = true;
        // this.router.navigate(['/tabs/life']);
        // const modal = await this.modalController.create({
        //     component: CounterPage,
        //     cssClass: 'modal-fullscreen',
        //     componentProps: {
        //         players: this.players,
        //     },
        // });
        // return await modal.present();
    }
    // incrementMuchLife(player: PlayerStats) {
    //     player.life += 3;
    // }
}