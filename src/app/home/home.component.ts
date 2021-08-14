import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { interval, of, from, Subject } from 'rxjs';
import { mergeMap, tap, takeUntil } from 'rxjs/operators';
import { StockDataService } from '../shared/service/stock-data.service';
import { Stock } from '../shared/interface/stock';
import { ToastrService } from 'ngx-toastr';
declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(
    private _StockService: StockDataService,
    private _Toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.refershPrice();
    this.getAllStocks();
  }

  private destory$: Subject<void> = new Subject();

  allStocks: Stock[] = [];
  totalBought: number = 0;
  totalCur: number = 0;
  totalYield: number = 0;
  symbols = of(
    'AEX.NL',
    'AALB.NL',
    'ABN.NL',
    'ADYEN.NL',
    'AGN.NL',
    'AD.NL',
    'AKZA.NL',
    'MT.NL',
    'ASML.NL',
    'ASRNL.NL',
    'DSM.NL',
    'GLPG.NL',
    'HEIA.NL',
    'IMCD.NL',
    'INGA.NL',
    'KPN.NL',
    'NN.NL',
    'PHIA.NL',
    'RAND.NL',
    'REN.NL',
    'RDSA.NL',
    'TKWY.NL',
    'URW.NL',
    'UNA.NL'
  );

  readonly addForm = new FormGroup({
    vwdKey: new FormControl('', Validators.required),
    volume: new FormControl('', Validators.required),
    open: new FormControl('', Validators.required),
  });

  getAllStocks() {
    from(this.symbols)
      .pipe(
        mergeMap((symbol) => this._StockService.getData(symbol)), // looping through symbols then Sending multiple parallel HTTP requests
        tap((_) => console.log('Http requests successful')),
        takeUntil(this.destory$)
      )
      .subscribe(
        (res: Stock) => {
          this.totalBought += Number(res.open);
          this.allStocks.push(res);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  refershPrice() {
    let time = interval(5000);
    time
      .pipe(
        tap(() => console.log('Refersh every 5 second')),
        takeUntil(this.destory$)
      )
      .subscribe(() => {
        this.allStocks.forEach((element: Stock) => {
          const vwdkey = element.vwdKey?.toLocaleUpperCase();
          this._StockService.getData(vwdkey || '').subscribe((res) => {
            element.price = res.price;
          });
        });
      });
  }

  addStock() {
    let newStock: Partial<Stock> = {
      vwdKey: this.addForm.controls.vwdKey.value,
      price: 0,
      volume: this.addForm.controls.volume.value,
      open: this.addForm.controls.open.value,
    };
    this.allStocks = this._StockService.addNewStock(newStock as Stock);
    $('#addStock').modal('hide');
    this.resetForm();
  }

  deleteStock(stock: Stock) {
    this.allStocks = this._StockService.removeStock(stock);
  }

  retrieveData() {
    this._StockService.allStocks = this.allStocks;
    this.allStocks = this._StockService.retrievePrevData();
  }

  buyStock(stock: Stock) {
    let mssg = this._StockService.buyStock(stock);
    this._Toastr.success(mssg);
  }

  getCurrentValue(stock: Stock) {
    const currentValue = stock.price || 0;
    const quantity = stock.volume || 0;

    let currentVal = (currentValue as number) * quantity;
    this.totalCur += currentVal;

    return currentVal;
  }

  getYield(stock: Stock) {
    const currentValue = this.getCurrentValue(stock) || 0;
    const price = stock.price || 0;
    let yieldVal = (((currentValue as number) - price) / price) * 100;
    this.totalYield += yieldVal;
    return yieldVal.toPrecision(3);
  }

  resetForm() {
    this.addForm.controls.vwdKey.setValue('');
    this.addForm.controls.volume.setValue('');
    this.addForm.controls.previousClose.setValue('');
  }

  ngOnDestroy() {
    this.destory$.unsubscribe();
  }
}
