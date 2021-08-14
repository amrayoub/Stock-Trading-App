import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { StockDataService } from '../shared/service/stock-data.service';
import { Stock } from '../shared/interface/stock';
@Component({
  selector: 'app-buying-cart',
  templateUrl: './buying-cart.component.html',
  styleUrls: ['./buying-cart.component.scss'],
})
export class BuyingCartComponent implements OnInit {
  myShares: Stock[] = [];
  constructor(
    private _StockService: StockDataService,
    private _Toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.UpdateShares();
  }

  UpdateShares() {
    this.myShares = JSON.parse(localStorage.getItem('myShares') || '{}');
  }

  sellStock(stock: Stock) {
    let mssg = this._StockService.sellStock(stock);
    if (mssg.includes('no') == true) {
      this._Toastr.error(mssg);
    } else {
      this._Toastr.success(mssg);
    }

    this.UpdateShares();
  }

  getCurValue(stock: Stock) {
    const currentValue = stock.price || 0;
    const quantity = stock.volume || 0;

    let currentVal = currentValue * quantity;

    return currentVal;
  }

  getYield(stock: Stock) {
    const currentValue = this.getCurValue(stock) || 0;
    const price = stock.price || 0;
    let yieldVal = ((currentValue - price) / price) * 100;
    return yieldVal;
  }
}
