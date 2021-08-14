import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Stock } from '../interface/stock';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class StockDataService {
  allStocks: Stock[] = [];
  newStocks: Stock[] = [];
  deletedStocks: Stock[] = [];
  myStock: Array<Stock>;
  myShares: Stock[] = [];
  constructor(private _http: HttpClient) {
    this.myStock = [];
    this.myStock = JSON.parse(localStorage.getItem('myShares') || '{}');
    this.myShares = Object.values(this.myStock);
  }
  getData(symbol: string): Observable<Stock> {
    if (symbol.length === 0) {
      return of(<Stock>{});
    }
    return this._http.get<Stock>(`${environment.apiUrlStock}${symbol}`);
  }

  addNewStock(newStock: Stock): Stock[] {
    this.allStocks = this.allStocks.filter((item: Stock) => {
      return item.vwdKey.toLowerCase() != newStock.vwdKey.toLowerCase();
    });
    this.allStocks.push(newStock);
    this.newStocks.push(newStock);
    localStorage.setItem('addations', JSON.stringify(this.newStocks));
    return this.allStocks;
  }
  removeStock(stock: Stock): Stock[] {
    this.allStocks = this.allStocks.filter((item: Stock) => {
      return item.vwdKey != stock.vwdKey;
    });
    this.deletedStocks.push(stock);
    localStorage.setItem('deletions', JSON.stringify(this.deletedStocks));
    return this.allStocks;
  }

  retrievePrevData(): Stock[] {
    if (localStorage.getItem('addations')) {
      this.newStocks = JSON.parse(localStorage.getItem('addations') || '{}');
      this.newStocks.forEach((element) => {
        this.allStocks = this.allStocks.filter((item: any) => {
          return item.vwdKey.toLowerCase() != element.vwdKey.toLowerCase();
        });
        this.allStocks.push(element);
      });
    }
    if (localStorage.getItem('deletions')) {
      this.deletedStocks = JSON.parse(
        localStorage.getItem('deletions') || '{}'
      );
      this.deletedStocks.forEach((element) => {
        this.allStocks = this.allStocks.filter((item: Stock) => {
          return item.vwdKey.toLowerCase() != element.vwdKey.toLowerCase();
        });
      });
    }
    return this.allStocks;
  }
  buyStock(stock: Stock): string {
    let a = this.allStocks.filter((item: Stock) => {
      return item.vwdKey == stock.vwdKey;
    });

    let index = this.findStockIndex(stock);
    if (index >= 0) {
      this.myShares[index].quantity = this.myShares[index].quantity + 1;
    } else {
      stock.quantity = 1;
      this.myShares.push(stock);
    }

    localStorage.setItem('myShares', JSON.stringify(this.myShares));
    return 'You have successfully bought a share!';
  }
  sellStock(stock: Stock): string {
    let index = this.findStockIndex(stock);
    if (index >= 0) {
      if (this.myShares[index].quantity >= 1) {
        this.myShares[index].quantity = this.myShares[index].quantity - 1;
      }
      if (this.myShares[index].quantity == 0) {
        this.myShares = this.myShares.filter((item: Stock) => {
          return item.vwdKey.toLowerCase() != stock.vwdKey.toLowerCase();
        });
      }
    } else {
      return 'You have no Shares to sell!';
    }

    localStorage.setItem('myShares', JSON.stringify(this.myShares));

    return 'You have successfully sold a share';
  }
  findStockIndex(stock: Stock) {
    return this.myShares.findIndex((item) => item.vwdKey === stock.vwdKey);
  }
}
